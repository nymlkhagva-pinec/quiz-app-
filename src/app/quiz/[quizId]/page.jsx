"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Page = () => {
  const params = useParams();
  const supabase = supabaseClient();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const quizId = params.quizId;

  useEffect(() => {
    const getQuizQuestions = async () => {
      const response = await supabase
        .from("quiz_questions")
        .select("*, quistion_answers(*)")
        .eq("quizId", quizId);

      setQuestions(response.data ?? []);
    };

    getQuizQuestions();
  }, [quizId]);

  const handleAnswer = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const answer = async () => {
    let totalPoint = 0;
    let myScore = 0;

    for (let i = 0; i < questions.length; i++) {
      totalPoint = totalPoint + questions[i].point;

      const correctAnswer = questions[i].quistion_answers.find((answer) => {
        return answer.isCorrect;
      });

      if (answers[correctAnswer.questionId] === correctAnswer.id) {
        myScore = myScore + questions[i].point;
      }
    }

    setResult({ totalPoint, myScore });

    const { data } = await supabase
      .from("quiz_attemtps")
      .insert({
        quizId: quizId,
        totalScore: totalPoint,
        score: myScore,
      })
      .select("*");

    const attemptId = data[0].id;

    for (let i = 0; i < questions.length; i++) {
      const correctAnswer = questions[i].quistion_answers.find((answer) => {
        return answer.isCorrect;
      });
      await supabase.from("quiz_attemtps_answer").insert({
        attemptId: attemptId,
        answerId: answers[questions[i].id],
        isCorrect: correctAnswer.id === answers[questions[i]],
      });
    }
  };

  const getBorderStyle = ({ isCorrect, isSelected }) => {
    if (result && isCorrect) return "border-green-500";
    if (result && isSelected) return "border-red-500";
    if (isSelected) return "border-sky-500";
  };

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quiz Questions</h1>

          <p className="text-muted-foreground">
            Review the questions and available answers.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((question, questionIndex) => {
            return (
              <Card key={question.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Question {questionIndex + 1}
                      </p>

                      <CardTitle className="text-xl">
                        {question.question}
                      </CardTitle>
                    </div>

                    <Badge variant="secondary">{question.point} point</Badge>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Answers</p>

                    <div className="space-y-2">
                      {question?.quistion_answers?.map(
                        (answer, answerIndex) => {
                          return (
                            <div
                              key={answer.id}
                              onClick={() =>
                                handleAnswer(question.id, answer.id)
                              }
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 ${getBorderStyle(
                                {
                                  isCorrect: answer.isCorrect,
                                  isSelected:
                                    answers[question.id] === answer.id,
                                },
                              )}`}
                            >
                              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                {String.fromCharCode(65 + answerIndex)}
                              </div>

                              <span className="text-sm">{answer.answer}</span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Button onClick={answer}>answer</Button>
          {result && (
            <div>
              <div>totalPoint: {result.totalPoint}</div>
              <div>score: {result.myScore}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
