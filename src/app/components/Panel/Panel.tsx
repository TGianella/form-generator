import { PropsWithChildren } from "react";

type PanelProps = PropsWithChildren<{
  title?: string;
  backgroundColorClass?: string;
}>;

export const Panel = ({
  title,
  children,
  backgroundColorClass,
}: PanelProps) => {
  return (
    <div
      className={`grow lg:grow-0 lg:h-[calc(100vh-5rem)] lg:w-4/12 flex flex-col gap-10 p-5 lg:overflow-y-scroll ${backgroundColorClass}`}
    >
      {title ? (
        <h2 className="font-bold self-center text-center text-xl">{title}</h2>
      ) : null}
      {children}
    </div>
  );
};
