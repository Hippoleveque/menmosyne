import React from "react";

import RevisionContent from "../components/Revision/RevisionContent";
import SideMenuLayout from "../components/Layouts/SideMenuLayout";

export default function RevisionPage() {
  return (
    <SideMenuLayout>
      <RevisionContent />
    </SideMenuLayout>
  );
}
