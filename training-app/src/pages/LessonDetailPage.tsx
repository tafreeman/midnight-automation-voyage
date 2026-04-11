import { useEffect } from "react";

import { useProgress } from "../contexts/ProgressContext";
import { useTheme } from "../contexts/ThemeContext";
import type { Lesson, Module } from "../types/curriculum";
import {
  LessonHero,
  LessonNarrationBar,
  SectionBlock,
  InlinePracticeCTA,
  QuizPanel,
  ExercisesOrSingle,
  PromptTemplatesPanel,
} from "./lesson-detail";

interface LessonDetailPageProps {
  module: Module;
  lesson: Lesson;
  onQuizAttempt: () => void;
}

export function LessonDetailPage({
  module,
  lesson,
  onQuizAttempt,
}: LessonDetailPageProps) {
  const { isLessonCompleted } = useProgress();
  const { applyModuleTheme } = useTheme();
  const completed = isLessonCompleted(module.id, lesson.id);
  const exercises = lesson.exercises ?? (lesson.exercise ? [lesson.exercise] : []);

  useEffect(() => {
    applyModuleTheme(module.number);
  }, [applyModuleTheme, module.number]);

  return (
    <div className="lesson-detail-page space-y-12">
      <LessonHero
        lesson={lesson}
        completed={completed}
      />

      {lesson.narrationScript && (
        <LessonNarrationBar script={lesson.narrationScript} />
      )}

      <div className="space-y-10">
        {lesson.sections.map((section, i) => (
          <SectionBlock key={i} section={section} />
        ))}
      </div>

      {lesson.practiceLink && (
        <InlinePracticeCTA
          url={lesson.practiceLink.url}
          label={lesson.practiceLink.label}
          description={lesson.practiceLink.description}
        />
      )}

      {lesson.quiz && (
        <QuizPanel quiz={lesson.quiz} onAttempt={onQuizAttempt} />
      )}

      {exercises.length > 0 && (
        <ExercisesOrSingle lesson={lesson} />
      )}

      {lesson.promptTemplates?.length ? (
        <PromptTemplatesPanel templates={lesson.promptTemplates} />
      ) : null}

      <div style={{ height: "2rem" }} />
    </div>
  );
}
