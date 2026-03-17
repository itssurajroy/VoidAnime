'use client';

export function ThemeStyles({ css }: { css: string }) {
  return (
    <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: css }} />
  );
}
