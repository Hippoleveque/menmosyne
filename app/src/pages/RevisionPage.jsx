import React from "react";

import { useParams } from "react-router-dom";
import RevisionManager from "../components/Revision/RevisionManager";
import SideMenuLayout from "../components/Layouts/SideMenuLayout";

export default function RevisionPage() {
  const { collectionId } = useParams();
  return (
    <SideMenuLayout>
      <RevisionManager collectionId={collectionId} />
    </SideMenuLayout>
  );
}
