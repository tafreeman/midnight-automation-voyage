import { Boxes, Diamond, Layers3, Milestone, PanelsTopLeft, Spline } from "lucide-react";

import {
  DiagramPanel,
  MiniSpecimen,
  ShapeSystemShowcase,
  ShapeToken,
  ThemedSection,
  TierBand,
} from "../shared";

export function ShapesSection() {
  return (
    <ThemedSection
      nativeTheme="arctic-steel"
      title="Shapes specimen"
      eyebrow="Native section theme"
      description="Shape language needs calm spacing and enough room to read each object family. The tier bands and tokens below are presented like a visual glossary rather than a cramped icon table."
    >
      <div className="space-y-5">
        <DiagramPanel title="Shape language" eyebrow="Vocabulary">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ShapeToken icon={<Layers3 size={18} />} label="Tier band" description="Stacked architecture levels" />
            <ShapeToken icon={<Diamond size={18} />} label="Node" description="Workflow or decision point" />
            <ShapeToken icon={<Boxes size={18} />} label="Card" description="Reusable content container" />
            <ShapeToken icon={<PanelsTopLeft size={18} />} label="Split panel" description="Two-column composition" />
            <ShapeToken icon={<Milestone size={18} />} label="Milestone" description="Roadmap or checkpoint marker" />
            <ShapeToken icon={<Spline size={18} />} label="Connector" description="Arrow or relationship hint" />
          </div>
        </DiagramPanel>
        <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
          <DiagramPanel title="Architecture tiers" eyebrow="Shape assembly">
            <div className="space-y-4">
              <TierBand title="Experience layer" />
              <TierBand title="Application layer" />
              <TierBand title="Data and automation layer" />
            </div>
          </DiagramPanel>
          <DiagramPanel title="Shape system in use" eyebrow="Applied example">
            <div className="space-y-4">
              <ShapeSystemShowcase />
              <div className="grid gap-3 md:grid-cols-3">
                <MiniSpecimen title="Hero object" body="Primary focal shape with protected whitespace." />
                <MiniSpecimen title="Connector" body="Directional relationship between steps or domains." />
                <MiniSpecimen title="Band" body="Layer grouping that keeps system boundaries readable." />
              </div>
            </div>
          </DiagramPanel>
        </div>
      </div>
    </ThemedSection>
  );
}
