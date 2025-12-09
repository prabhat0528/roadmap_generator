import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

export default function RoadmapTimeline({ roadmapText }) {
  if (!roadmapText) return null;

  // 1. Prepare the text for splitting:
  // Remove common headers (like "Roadmap: X" and "Duration: Y") that often appear
  // at the start of the AI's response, so they don't become the first step.
  const cleanedText = roadmapText
      .replace(/Roadmap:.*?\n/i, '')
      .replace(/Duration:.*?\n/i, '')
      .trim();

  // 2. Robustly split the text into steps:
  // This uses a regex to split the text based on **one or more empty lines**
  // (a standard way to delineate paragraphs/sections in Markdown).
  // This is more reliable than splitting by single words like 'Week' or 'Day'.
  const steps = cleanedText.split(/\n\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
      
  // Optional: Add a check for minimal steps
  if (steps.length < 2) {
      return (
          <p style={{ color: 'gray', textAlign: 'center' }}>
              Timeline view is not available for this format.
          </p>
      );
  }

  return (
    <VerticalTimeline>
      {steps.map((step, index) => {
        // Find the first line to use as the title/milestone name
        const titleMatch = step.match(/^(.*?)\n/);
        const title = titleMatch ? titleMatch[1].trim() : `Milestone ${index + 1}`;
        // The rest is the description
        const description = step.replace(title, '').trim();

        return (
          <VerticalTimelineElement
            key={index}
            date={`Step ${index + 1}`}
            iconStyle={{ background: "#007bff", color: "#fff" }}
          >
            <h3 className="vertical-timeline-element-title">{title}</h3>
            {/* Using <pre> to maintain formatting (like lists) from the AI's Markdown */}
            <pre style={{ whiteSpace: "pre-wrap", margin: 0, padding: 0, border: 'none' }}>
              {description}
            </pre>
          </VerticalTimelineElement>
        );
      })}
    </VerticalTimeline>
  );
}