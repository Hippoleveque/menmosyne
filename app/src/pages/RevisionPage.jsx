import React from "react";

import { useParams } from "react-router-dom";
import RevisionContent from "../components/Revision/RevisionContent";
import SideMenuLayout from "../components/Layouts/SideMenuLayout";

export default function RevisionPage() {
  const { collectionId } = useParams();
  return (
    <SideMenuLayout>
      <RevisionContent collectionId={collectionId} />
    </SideMenuLayout>
  );
}
