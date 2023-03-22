import React, { useContext, useRef } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { AuthContext } from "../../store/auth-context";

export default function ImportContent() {
  const { loginToken } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file, file.name);
    const response = await fetch("/api/import/anki", {
      method: "POST",
      body: data,
      headers: {
        Authorization: "Bearer " + loginToken,
      },
    });
    await response.json();
  };

  const handleFileUpload = (e) => {
    fileInputRef.current?.click();
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Importer une collection Anki
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "end ",
        }}
      >
        <Button variant="contained" size="small" onClick={handleFileUpload}>
          Importer un fichier .apkg
          <input
            hidden
            accept="*.apkg"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            data-testid="upload-file-button-import"
          />
        </Button>
      </CardActions>
    </Card>
  );
}
