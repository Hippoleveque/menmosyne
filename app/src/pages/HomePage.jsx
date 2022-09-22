import React from "react";

import HomeContent from "../components/Home/HomeContent";
import SideMenuLayout from "../components/Layouts/SideMenuLayout";

export default function HomePage() {
  return (
    <SideMenuLayout>
      <HomeContent />
    </SideMenuLayout>
  );
}
