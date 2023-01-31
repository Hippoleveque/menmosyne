import React from "react";

import { useParams } from "react-router-dom";
import CollectionDetailContent from "../components/CollectionDetail/CollectionDetailContent";
import SideMenuLayout from "../components/Layouts/SideMenuLayout";

export default function CollectionDetailPage() {
  const { collectionId } = useParams();
  return (
    <SideMenuLayout>
      <CollectionDetailContent collectionId={collectionId} />
    </SideMenuLayout>
  );
}
