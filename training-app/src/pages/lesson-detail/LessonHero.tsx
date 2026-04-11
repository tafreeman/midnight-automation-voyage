import type { Lesson } from "../../types/curriculum";

interface LessonHeroProps {
  lesson: Lesson;
  completed: boolean;
}

export function LessonHero({ lesson, completed }: LessonHeroProps) {
  const stats: string[] = [
    `${lesson.estimatedMinutes} min`,
    `${lesson.sections.length} sections`,
  ];
  if (lesson.quiz) stats.push("quiz included");
  if (lesson.practiceLink) stats.push("practice included");

  return (
    <section className="page-hero lesson-hero">
      <h1
        className="text-2xl font-semibold tracking-tight md:text-3xl"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
      >
        {lesson.title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        {lesson.subtitle}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
        {stats.map((stat, i) => (
          <span key={stat}>
            {i > 0 && <span className="mr-2">·</span>}
            {stat}
          </span>
        ))}
        {completed && (
          <span style={{ color: "var(--accent-action)" }}>
            <span className="mr-2">·</span>
            Completed
          </span>
        )}
      </div>
    </section>
  );
}
