import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, MessageCircleQuestion, Brain, Laptop2, ArrowRight, RotateCcw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/Button";
import { ScoreRadial } from "@/components/charts/ScoreRadial";
import { useSubmitMockInterviewMutation } from "@/hooks/useStudentMutations";
import { MOCK_INTERVIEW_QUESTIONS } from "@/constants/studentMockData";
import type { InterviewFeedback, InterviewType } from "@/types/student";

const TYPE_META: { type: InterviewType; icon: typeof Code2; description: string }[] = [
  { type: "Technical", icon: Code2, description: "Core CS & framework concepts" },
  { type: "HR", icon: MessageCircleQuestion, description: "Behavioral & culture-fit questions" },
  { type: "Aptitude", icon: Brain, description: "Logical & quantitative reasoning" },
  { type: "Coding", icon: Laptop2, description: "Live problem solving" },
];

export function MockInterview() {
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const submitMutation = useSubmitMockInterviewMutation();

  const questions = selectedType ? MOCK_INTERVIEW_QUESTIONS[selectedType] : [];
  const currentQuestion = questions[step];

  const handleStart = (type: InterviewType) => {
    setSelectedType(type);
    setStep(0);
    setAnswers({});
    setFeedback(null);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else if (selectedType) {
      submitMutation.mutate(
        { type: selectedType, answers },
        { onSuccess: (data) => setFeedback(data) }
      );
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setStep(0);
    setAnswers({});
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">AI Mock Interview</h1>
        <p className="text-sm text-muted-foreground">
          Practice technical, HR, aptitude, and coding rounds with instant AI feedback.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedType && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {TYPE_META.map(({ type, icon: Icon, description }) => (
              <Card key={type} className="flex flex-col items-center gap-3 p-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{type}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <Button size="sm" className="w-full" onClick={() => handleStart(type)}>
                  Start
                </Button>
              </Card>
            ))}
          </motion.div>
        )}

        {selectedType && !feedback && currentQuestion && (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
          >
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">
                  {selectedType} Interview · Question {step + 1} of {questions.length}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-3.5 w-3.5" /> Restart
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm font-medium text-foreground">{currentQuestion.question}</p>
                <FormTextarea
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
                  }
                />
                <div className="flex justify-end">
                  <Button onClick={handleNext} isLoading={submitMutation.isPending}>
                    {step < questions.length - 1 ? "Next question" : "Finish & get feedback"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <Card className="flex flex-col items-center justify-center py-8">
              <ScoreRadial score={feedback.overallScore} label="Overall Performance" size={170} />
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Communication", value: feedback.communication },
                  { label: "Technical Accuracy", value: feedback.technicalAccuracy },
                  { label: "Confidence", value: feedback.confidence },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.value}/100</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {feedback.strengths.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Areas to Improve</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {feedback.improvements.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="lg:col-span-3">
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4" /> Try another round
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MockInterview;
