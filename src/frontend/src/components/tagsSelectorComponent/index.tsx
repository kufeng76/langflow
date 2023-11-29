import { useContext, useEffect, useRef, useState } from "react";
import { darkContext } from "../../contexts/darkContext";
import { cn } from "../../utils/utils";
import { Badge } from "../ui/badge";

export function TagsSelector({
  tags,
  disabled = false,
  loadingTags,
  selectedTags,
  setSelectedTags,
}: {
  tags: { id: string; name: string }[];
  disabled?: boolean;
  loadingTags: boolean;
  selectedTags: any[];
  setSelectedTags: (tags: any[]) => void;
}) {
  const updateTags = (tagName: string) => {
    const index = selectedTags.indexOf(tagName);
    let newArray =
      index === -1
        ? [...selectedTags, tagName]
        : selectedTags.filter((_, i) => i !== index);
    setSelectedTags(newArray);
  };
  const { dark } = useContext(darkContext);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fadeContainerRef = useRef<HTMLDivElement>(null);
  const [divWidth, setDivWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current) {
        setDivWidth(scrollContainerRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // call the function at start to get the initial width
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || !fadeContainerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const atStart = scrollLeft === 0;
      const atEnd = scrollLeft === scrollWidth - clientWidth;
      const isScrollable = scrollWidth > clientWidth;

      fadeContainerRef.current.classList.toggle(
        "fade-left",
        isScrollable && !atStart
      );
      fadeContainerRef.current.classList.toggle(
        "fade-right",
        isScrollable && !atEnd
      );
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Delay the initial scroll event dispatch to ensure correct calculation
      scrollContainer.dispatchEvent(new Event("scroll"));
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [divWidth, loadingTags]); // Depend on divWidth

  return (
    <div ref={fadeContainerRef} className="fade-container">
      <div ref={scrollContainerRef} className="scroll-container flex gap-2">
        {!loadingTags &&
          tags.map((tag, idx) => (
            <button
              disabled={disabled}
              className={disabled ? "cursor-not-allowed" : ""}
              onClick={() => {
                updateTags(tag.name);
              }}
              key={idx}
            >
              <Badge
                key={idx}
                variant="outline"
                size="sq"
                className={cn(
                  selectedTags.some((category) => category === tag.name)
                    ? "bg-beta-foreground text-background hover:bg-beta-foreground"
                    : ""
                )}
              >
                {tag.name}
              </Badge>
            </button>
          ))}
      </div>
    </div>
  );
}
