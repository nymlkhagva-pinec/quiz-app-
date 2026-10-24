"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const CreateQuizPage = () => {
  const supabase = supabaseClient();

  const [quiz, setQuiz] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      point: 0,
      answers: ["", "", "", ""],
      correctIndex: 0,
    },
  ]);

  const handleQuizName = (event) => setQuiz(event.target.value);

  const handleQuestion = (value, field, questionIndex) => {
    const updatedQuestion = questions.map((question, index) => {
      if (questionIndex === index) {
        return { ...question, [field]: value };
      } else {
        return question;
      }
    });

    setQuestions(updatedQuestion);
  };

  const handleAnswers = (questionIndex, answerIndex, value) => {
    const updatedQuestions = questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        return {
          ...question,
          answers: question.answers.map((answer, aIndex) => {
            if (aIndex === answerIndex) {
              return value;
            } else {
              return answer;
            }
          }),
        };
      } else {
        return question;
      }
    });

    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        point: 0,
        answers: ["", "", "", ""],
        correctIndex: 0,
      },
    ]);
  };

  const createQuiz = async () => {
    const response = await supabase
      .from("quiz")
      .insert({
        quizName: quiz,
      })
      .select("*")
      .single();

    const quizId = response.data.id;

    for (let i = 0; i < questions.length; i++) {
      const response = await supabase
        .from("quiz_questions")
        .insert({
          question: questions[i].question,
          quizId: quizId,
          point: questions[i].point,
        })
        .select("*");

      const questionId = response.data[0].id;

      for (let j = 0; j < questions[i].answers.length; j++) {
        await supabase.from("quistion_answers").insert({
          questionId: questionId,
          answer: questions[i].answers[j],
          isCorrect: questions[i].correctIndex === j,
        });
      }

      console.log(response, "question");
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
          <p className="text-muted-foreground">
            Create a quiz and add questions with multiple-choice answers.
          </p>
        </div>

        {/* Quiz information */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="quiz-name">Quiz name</Label>
              <Input
                id="quiz-name"
                placeholder="Enter quiz name..."
                onChange={(e) => handleQuizName(e)}
                value={quiz}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((question, questionIndex) => {
            return (
              <Card key={questionIndex}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">
                      Question {questionIndex + 1}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add the question and its possible answers.
                    </p>
                  </div>

                  <div className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                    {question.point} point
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Question */}
                  <div className="grid gap-2">
                    <Label htmlFor={`question-${questionIndex}`}>
                      Question
                    </Label>

                    <Input
                      id={`question-${questionIndex}`}
                      placeholder="Write your question..."
                      value={question.question}
                      onChange={(e) =>
                        handleQuestion(
                          e.target.value,
                          "question",
                          questionIndex,
                        )
                      }
                    />
                  </div>

                  {/* Points */}
                  <div className="grid max-w-[180px] gap-2">
                    <Label htmlFor={`point-${questionIndex}`}>Points</Label>

                    <Input
                      id={`point-${questionIndex}`}
                      placeholder="0"
                      type="number"
                      min={0}
                      value={question.point}
                      onChange={(event) =>
                        handleQuestion(
                          Number(event.target.value),
                          "point",
                          questionIndex,
                        )
                      }
                    />
                  </div>

                  <Separator />

                  {/* Answers */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Answers</h3>
                      <p className="text-sm text-muted-foreground">
                        Select the correct answer.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {question.answers.map((answer, answerIndex) => {
                        return (
                          <div
                            key={answerIndex}
                            className="flex items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/50"
                          >
                            <Checkbox
                              id={`answer-${questionIndex}-${answerIndex}`}
                              checked={question.correctIndex === answerIndex}
                              onCheckedChange={() =>
                                handleQuestion(
                                  answerIndex,
                                  "correctIndex",
                                  questionIndex,
                                )
                              }
                            />

                            <Label
                              htmlFor={`answer-${questionIndex}-${answerIndex}`}
                              className="w-7 shrink-0 text-sm font-semibold text-muted-foreground"
                            >
                              {String.fromCharCode(65 + answerIndex)}
                            </Label>

                            <Input
                              placeholder={`Answer ${answerIndex + 1}...`}
                              value={answer}
                              onChange={(e) =>
                                handleAnswers(
                                  questionIndex,
                                  answerIndex,
                                  e.target.value,
                                )
                              }
                              className="border-0 shadow-none focus-visible:ring-0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            className="sm:order-1"
          >
            + Add Question
          </Button>

          <Button type="button" onClick={createQuiz} className="sm:order-2">
            Create Quiz
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CreateQuizPage;
