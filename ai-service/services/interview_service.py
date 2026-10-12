"""
services/interview_service.py
===============================
Purpose:
    Business logic for the AI Interview Question Generation module.
    Generates technical, HR, coding, MCQ, and behavioral questions
    (with answers) tailored to a candidate's skill set and target role,
    at Easy/Medium/Hard difficulty levels.

Architecture:
    Question generation is template-driven: a per-skill technical/coding
    question bank plus generic HR/behavioral banks, all defined as data
    in this module. This is a deterministic, fully-offline substitute
    for an LLM-based question generator, guaranteeing the endpoint
    always returns real, complete question+answer pairs with no network
    dependency.

Usage Example:
    from services.interview_service import get_interview_service
    service = get_interview_service()
    result = service.generate(request)
"""

from __future__ import annotations

import random
from functools import lru_cache
from typing import Dict, List, Optional

from models.common import DifficultyLevel
from models.interview import InterviewGenerationRequest, InterviewGenerationResponse, QuestionItem
from utils.logger import logger
from utils.text_cleaner import normalize_skill_name

# --- Per-skill technical question bank (skill -> list of (question, answer, difficulty)) ---
_TECHNICAL_BANK: Dict[str, List[tuple]] = {
    "python": [
        ("What is the difference between a list and a tuple in Python?",
         "Lists are mutable and defined with [], while tuples are immutable and defined with (). "
         "Tuples are generally faster and used for fixed collections of items.", DifficultyLevel.EASY),
        ("Explain Python's Global Interpreter Lock (GIL).",
         "The GIL is a mutex that allows only one thread to execute Python bytecode at a time in "
         "CPython, which simplifies memory management but limits true parallelism for CPU-bound "
         "multi-threaded programs.", DifficultyLevel.HARD),
        ("What are decorators in Python and how do you use them?",
         "Decorators are functions that wrap another function to extend its behavior without "
         "modifying its code, applied using the @decorator_name syntax above a function definition.",
         DifficultyLevel.MEDIUM),
    ],
    "fastapi": [
        ("How does FastAPI achieve high performance compared to Flask?",
         "FastAPI is built on Starlette and uses ASGI with async/await support, enabling "
         "non-blocking I/O and concurrent request handling, unlike Flask's default WSGI sync model.",
         DifficultyLevel.MEDIUM),
        ("What is dependency injection in FastAPI and why is it useful?",
         "FastAPI's Depends() system lets you declare reusable logic (DB sessions, auth checks) "
         "that is automatically resolved and injected into path operation functions, improving "
         "modularity and testability.", DifficultyLevel.MEDIUM),
    ],
    "sql": [
        ("What is the difference between INNER JOIN and LEFT JOIN?",
         "INNER JOIN returns only rows with matching values in both tables, while LEFT JOIN returns "
         "all rows from the left table plus matched rows from the right table, with NULLs where "
         "there is no match.", DifficultyLevel.EASY),
        ("Explain database normalization and its normal forms.",
         "Normalization organizes data to reduce redundancy and improve integrity by decomposing "
         "tables through normal forms (1NF removes repeating groups, 2NF removes partial "
         "dependencies, 3NF removes transitive dependencies).", DifficultyLevel.MEDIUM),
    ],
    "react": [
        ("What is the Virtual DOM and how does React use it?",
         "The Virtual DOM is an in-memory representation of the real DOM. React updates this "
         "lightweight copy first, diffs it against the previous version, and applies only the "
         "minimal necessary changes to the real DOM for performance.", DifficultyLevel.MEDIUM),
        ("What is the difference between state and props in React?",
         "Props are read-only data passed from a parent to a child component, while state is "
         "local, mutable data managed within a component using hooks like useState.",
         DifficultyLevel.EASY),
    ],
    "machine learning": [
        ("What is the difference between supervised and unsupervised learning?",
         "Supervised learning trains models on labeled data to predict outcomes, while unsupervised "
         "learning finds patterns/structure in unlabeled data, such as clustering.", DifficultyLevel.EASY),
        ("Explain the bias-variance tradeoff.",
         "Bias is error from overly simplistic assumptions (underfitting), and variance is error "
         "from sensitivity to training data fluctuations (overfitting). Good models balance both "
         "to minimize total generalization error.", DifficultyLevel.HARD),
    ],
    "docker": [
        ("What is the difference between a Docker image and a container?",
         "A Docker image is a read-only template with application code and dependencies, while a "
         "container is a running, writable instance of that image.", DifficultyLevel.EASY),
    ],
    "java": [
        ("What is the difference between JDK, JRE, and JVM?",
         "JDK is the full development kit (compiler + tools), JRE provides the runtime environment "
         "to run Java applications, and JVM is the virtual machine that executes Java bytecode.",
         DifficultyLevel.EASY),
    ],
    "mongodb": [
        ("How does MongoDB differ from a relational database?",
         "MongoDB is a document-oriented NoSQL database storing flexible, schema-less JSON-like "
         "documents in collections, unlike relational databases that use fixed schemas with tables "
         "and rows.", DifficultyLevel.EASY),
    ],
    "aws": [
        ("What is the difference between EC2 and Lambda?",
         "EC2 provides resizable virtual servers you manage continuously, while Lambda is a "
         "serverless compute service that runs code in response to events without managing servers.",
         DifficultyLevel.MEDIUM),
    ],
}

_GENERIC_TECHNICAL = [
    ("Explain the concept of Big-O notation and give an example.",
     "Big-O notation describes an algorithm's worst-case time/space complexity as input size grows, "
     "e.g. O(n) for a single loop through a list, used to compare algorithm efficiency.",
     DifficultyLevel.MEDIUM),
    ("What is the difference between REST and GraphQL APIs?",
     "REST exposes fixed endpoints returning fixed data structures, while GraphQL exposes a single "
     "endpoint where clients specify exactly the data fields they need in one query.",
     DifficultyLevel.MEDIUM),
]

_CODING_BANK: Dict[str, List[tuple]] = {
    "python": [
        ("Write a function to check if a string is a palindrome.",
         "def is_palindrome(s):\n    s = s.lower().replace(' ', '')\n    return s == s[::-1]",
         DifficultyLevel.EASY),
        ("Write a function to find the second largest number in a list.",
         "def second_largest(nums):\n    unique = sorted(set(nums), reverse=True)\n"
         "    return unique[1] if len(unique) > 1 else None", DifficultyLevel.MEDIUM),
    ],
    "javascript": [
        ("Write a function to reverse an array in JavaScript without using reverse().",
         "function reverseArray(arr) {\n  let result = [];\n  for (let i = arr.length - 1; i >= 0; i--) {\n"
         "    result.push(arr[i]);\n  }\n  return result;\n}", DifficultyLevel.EASY),
    ],
    "java": [
        ("Write a Java method to check whether a number is prime.",
         "boolean isPrime(int n) {\n  if (n < 2) return false;\n  for (int i = 2; i * i <= n; i++) {\n"
         "    if (n % i == 0) return false;\n  }\n  return true;\n}", DifficultyLevel.EASY),
    ],
}
_GENERIC_CODING = [
    ("Write a function to find the factorial of a number using recursion.",
     "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
     DifficultyLevel.EASY),
    ("Write a function to check whether two strings are anagrams of each other.",
     "def is_anagram(a, b):\n    return sorted(a.replace(' ', '').lower()) == sorted(b.replace(' ', '').lower())",
     DifficultyLevel.MEDIUM),
]

_MCQ_BANK: Dict[str, List[tuple]] = {
    "python": [
        ("Which of the following is NOT a Python built-in data type?",
         ["list", "dict", "array", "tuple"], "array", DifficultyLevel.EASY),
    ],
    "sql": [
        ("Which SQL clause is used to filter groups after aggregation?",
         ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], "HAVING", DifficultyLevel.MEDIUM),
    ],
    "machine learning": [
        ("Which algorithm is primarily used for classification problems?",
         ["Linear Regression", "K-Means", "Logistic Regression", "PCA"], "Logistic Regression",
         DifficultyLevel.MEDIUM),
    ],
}
_GENERIC_MCQ = [
    ("What does 'API' stand for?",
     ["Application Programming Interface", "Automated Process Integration",
      "Application Process Interface", "Advanced Programming Instruction"],
     "Application Programming Interface", DifficultyLevel.EASY),
    ("Which data structure uses FIFO (First In First Out) ordering?",
     ["Stack", "Queue", "Tree", "Graph"], "Queue", DifficultyLevel.EASY),
]

_HR_BANK = [
    ("Tell me about yourself.",
     "A strong answer summarizes your education, key skills, notable projects/experience, and "
     "career goals in under 2 minutes, tailored to the role you're applying for.", DifficultyLevel.EASY),
    ("Why do you want to work at our company?",
     "Research the company's mission, products, and culture, then connect specific aspects of it "
     "to your own skills, values, and career goals to show genuine, informed interest.", DifficultyLevel.EASY),
    ("Where do you see yourself in 5 years?",
     "Describe realistic growth within the field/role you're applying for, showing ambition while "
     "staying relevant to the company's growth path.", DifficultyLevel.MEDIUM),
    ("What are your strengths and weaknesses?",
     "Pick strengths relevant to the role with a concrete example, and a genuine weakness paired "
     "with the concrete steps you're taking to improve it.", DifficultyLevel.MEDIUM),
]

_BEHAVIORAL_BANK = [
    ("Describe a time you faced a conflict with a teammate and how you resolved it.",
     "Use the STAR method (Situation, Task, Action, Result): describe the context, your specific "
     "actions to address the conflict constructively, and the positive outcome.", DifficultyLevel.MEDIUM),
    ("Tell me about a project where you had to learn a new technology quickly.",
     "Highlight your learning process (documentation, tutorials, practice), the timeline pressure, "
     "and how you successfully applied the new technology to deliver the project.", DifficultyLevel.MEDIUM),
    ("Describe a situation where you missed a deadline. What did you do?",
     "Focus on ownership of the mistake, the corrective communication/action taken, and the lesson "
     "learned that you've since applied to avoid repeating it.", DifficultyLevel.HARD),
]


class InterviewService:
    """
    Generates a full interview question set (technical, HR, coding,
    MCQ, behavioral) tailored to a candidate's skills and target role.
    """

    def generate(self, request: InterviewGenerationRequest) -> InterviewGenerationResponse:
        """
        Generate interview questions across all requested categories.

        Parameters:
            request: Skills, role, difficulty filter, and per-category counts.

        Returns:
            InterviewGenerationResponse with populated question lists.
        """
        normalized_skills = [normalize_skill_name(s) for s in request.skills]

        technical = self._pick_questions(
            self._collect_from_bank(_TECHNICAL_BANK, normalized_skills, _GENERIC_TECHNICAL),
            request.num_technical, "technical", request.difficulty,
        )
        coding = self._pick_questions(
            self._collect_from_bank(_CODING_BANK, normalized_skills, _GENERIC_CODING),
            request.num_coding, "coding", request.difficulty,
        )
        mcq = self._pick_mcq_questions(normalized_skills, request.num_mcq, request.difficulty)
        hr = self._pick_questions(
            [(q, a, d) for q, a, d in _HR_BANK], request.num_hr, "hr", request.difficulty,
        )
        behavioral = self._pick_questions(
            [(q, a, d) for q, a, d in _BEHAVIORAL_BANK], request.num_behavioral, "behavioral", request.difficulty,
        )

        logger.info(
            f"Generated interview set: technical={len(technical)} coding={len(coding)} "
            f"mcq={len(mcq)} hr={len(hr)} behavioral={len(behavioral)}"
        )

        return InterviewGenerationResponse(
            role=request.role,
            technical_questions=technical,
            hr_questions=hr,
            coding_questions=coding,
            mcq_questions=mcq,
            behavioral_questions=behavioral,
        )

    @staticmethod
    def _collect_from_bank(bank: Dict[str, List[tuple]], skills: List[str], generic: List[tuple]) -> List[tuple]:
        collected: List[tuple] = []
        for skill in skills:
            if skill in bank:
                collected.extend(bank[skill])
        collected.extend(generic)
        return collected

    @staticmethod
    def _pick_questions(
        pool: List[tuple], count: int, category: str, difficulty_filter: Optional[DifficultyLevel]
    ) -> List[QuestionItem]:
        if count <= 0 or not pool:
            return []

        filtered = [item for item in pool if not difficulty_filter or item[2] == difficulty_filter]
        if not filtered:
            filtered = pool

        # Deduplicate by question text while preserving order.
        seen = set()
        unique_pool = []
        for item in filtered:
            if item[0] not in seen:
                unique_pool.append(item)
                seen.add(item[0])

        sample_size = min(count, len(unique_pool))
        chosen = random.sample(unique_pool, sample_size) if sample_size < len(unique_pool) else unique_pool[:count]

        return [
            QuestionItem(question=q, answer=a, difficulty=d, category=category)
            for q, a, d in chosen
        ]

    @staticmethod
    def _pick_mcq_questions(
        skills: List[str], count: int, difficulty_filter: Optional[DifficultyLevel]
    ) -> List[QuestionItem]:
        if count <= 0:
            return []

        pool: List[tuple] = []
        for skill in skills:
            if skill in _MCQ_BANK:
                pool.extend(_MCQ_BANK[skill])
        pool.extend(_GENERIC_MCQ)

        filtered = [item for item in pool if not difficulty_filter or item[3] == difficulty_filter]
        if not filtered:
            filtered = pool

        seen = set()
        unique_pool = []
        for item in filtered:
            if item[0] not in seen:
                unique_pool.append(item)
                seen.add(item[0])

        sample_size = min(count, len(unique_pool))
        chosen = random.sample(unique_pool, sample_size) if sample_size < len(unique_pool) else unique_pool[:count]

        return [
            QuestionItem(question=q, answer=answer, difficulty=d, category="mcq", options=options)
            for q, options, answer, d in chosen
        ]


@lru_cache(maxsize=1)
def get_interview_service() -> InterviewService:
    """Return a process-wide cached InterviewService instance."""
    return InterviewService()
