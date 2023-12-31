import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import { useGlobalState } from "@/app/components/context";
import { addKeyword } from "../../(processor)/actions";
import { deleteKeyword, editUseDefaultKeywords } from "../actions";

export default function KeywordTab({ tab, index }) {
  const {
    user,
    addMsg,
    userCategories,
    setAddKeywordLoading,
    setUserCategories,
    setDeleteKeywordLoading,
    setEditUseDefaultKeywordsLoading,
  } = useGlobalState();
  const [activeCategory, setActiveCategory] = useState(
    Object.keys(userCategories)[0]
  );
  const [newKeyword, setNewKeyword] = useState("");
  const [useDefaultKeywords, setUseDefaultKeywords] = useState(
    user.use_default_keywords
  );

  const categoryRef = userCategories[activeCategory].ref;

  const handleSubmit = async () => {
    if (newKeyword === "") {
      addMsg("error", "Cannot add a blank keyword.");
      return;
    }

    await addKeyword(
      user.user_id,
      categoryRef,
      newKeyword,
      setAddKeywordLoading,
      addMsg
    );

    const updatedCategories = { ...userCategories };
    updatedCategories[activeCategory].keys.push(newKeyword);
    setUserCategories(updatedCategories);

    setNewKeyword("");
  };

  const handleDelete = async (keyword) => {
    await deleteKeyword(
      user.user_id,
      categoryRef,
      keyword,
      setDeleteKeywordLoading,
      addMsg
    );
  };

  const handleChangeDefaultKeywords = async (val) => {
    await editUseDefaultKeywords(
      user.user_id,
      setEditUseDefaultKeywordsLoading,
      addMsg
    );

    setUseDefaultKeywords(val);
  };

  if (tab !== index) {
    return;
  }

  return (
    <>
      <Grid container sx={{ padding: "30px 0" }}>
        <Grid item xs={6}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "white",
                width: "90%",
                margin: "0 auto",
              }}
            >
              Select a Category:
            </Typography>
            <Select
              onChange={(e) => setActiveCategory(e.target.value)}
              value={activeCategory}
              sx={{
                color: "white",
                border: "1px solid white",
                "& .MuiSelect-icon": {
                  color: "white",
                },
                height: "40px",
                width: "90%",
                margin: "0 auto",
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              {Object.keys(userCategories).map((cat, index) => (
                <MenuItem value={cat} key={index}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
            <Typography
              variant="subtitle1"
              sx={{
                color: "white",
                width: "90%",
                margin: "0 auto",
                paddingTop: "20px",
              }}
            >
              Keywords:
            </Typography>
            <List
              sx={{
                width: "90%",
                margin: "0 auto",
                border: "1px solid white",
                borderRadius: "5px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {userCategories[activeCategory].keys.map((key, index) => (
                <ListItem
                  sx={{ height: "35px" }}
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      sx={{ color: "white" }}
                      onClick={() => handleDelete(key)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={key} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "white",
                width: "90%",
                margin: "0 auto",
              }}
            >
              New Keyword:
            </Typography>
            <Box
              sx={{
                width: "90%",
                display: "flex",
                margin: "0 auto",
              }}
            >
              <TextField
                variant="outlined"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                sx={{
                  border: "1px solid white",
                  borderRadius: "5px",
                  "& input": {
                    color: "white",
                    padding: "8px 8px 8px 12px",
                  },
                  width: "90%",
                }}
              />
              <Button
                onClick={() => handleSubmit()}
                component="label"
                variant="contained"
                color="success"
              >
                <SaveIcon />
              </Button>
            </Box>
            <Box sx={{ width: "90%", margin: "10px auto" }}>
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={useDefaultKeywords} />}
                  label="Use default keywords?"
                  onChange={(e) =>
                    handleChangeDefaultKeywords(e.target.checked)
                  }
                />
              </FormGroup>
              <Typography variant="subtitle2">
                You will need to log out and log back in to see changes.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
