import React, { useContext, useRef } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { AuthContext } from "../../store/auth-context";

export default function ImportContent() {
  // const [file, setFile] = useState(null);
  const { loginToken } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    console.log("handle file change has been called");
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file, file.name);
    console.log(data);
    fetch("/api/import/import", {
      method: "POST",
      body: data,
      headers: {
        Authorization: "Bearer " + loginToken,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  const handleFileUpload = (e) => {
    fileInputRef.current?.click();
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Import From Anki Collection
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
          />
        </Button>
      </CardActions>
    </Card>
  );
}
