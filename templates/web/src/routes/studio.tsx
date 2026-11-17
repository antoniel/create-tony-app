import { createFileRoute } from "@tanstack/react-router";
import { DesignStudio } from "../studio/studio";

export const Route = createFileRoute("/studio")({ component: DesignStudio });
