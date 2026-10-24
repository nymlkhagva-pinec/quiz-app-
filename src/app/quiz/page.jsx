"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const Page = () => {
  const supabase = supabaseClient();
  const [quiz, setQuiz] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getQuiz = async () => {
      const response = await supabase.from("quiz").select("*");
      setQuiz(response.data);
    };

    getQuiz();
  }, []);

  const handleRedirect = (quizId) => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>

          <p className="text-muted-foreground">Browse all available quizzes.</p>
        </div>

        {/* Quiz list */}
        <div className="space-y-4">
          {quiz.map((item) => {
            return (
              <Card
                key={item.id}
                className="transition-shadow hover:shadow-md"
                onClick={() => handleRedirect(item.id)}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{item.quizName}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Created
                    </span>

                    <span className="text-sm font-medium">
                      {item?.created_at}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Page;
