import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import "@fontsource/public-sans";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/joy";
import {
  ArrowDropDownOutlined,
  DeleteForeverOutlined,
} from "@mui/icons-material";
import AddProfileButton from "../components/AddProfileButton";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  const toggleSelectedProfile = (profile) => {
    if (selectedProfiles.includes(profile)) {
      setSelectedProfiles([...selectedProfiles.filter(selectedProfile => selectedProfile !== profile)])
    } else {
      setSelectedProfiles([...selectedProfiles, profile])
    }
  }

  const getProfiles = useCallback(
    async () =>
      invoke("list_profiles").then((value: string[]) => {
        if (value) {
          setProfiles(value.sort((a, b) => a.localeCompare(b)));
          setSelectedProfiles([value[0]]);
          setLoading(false);
        }
      }),
    []
  );
  useEffect(() => {
    (async () => {
      await getProfiles();
    })();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box p={4}>
      {/* <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          background:
            "linear-gradient(142deg, rgb(159, 89, 120) 0%, r#537193100%)",
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      /> */}
      {loading ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="loading"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box>
            <Typography sx={{ textAlign: "center", mb: 2 }} level="h1">
              Flyzer
            </Typography>
            <Box>
              <Grid container justifyContent="center" pb={2}>
                <Button
                  disabled={selectedProfiles.length === 0}
                  sx={{
                    fontSize: "xl",
                    color: "black",
                    background:
                      "linear-gradient(142deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
                    "&:disabled": {
                      background:
                        "linear-gradient(142deg, rgba(238,174,202,0.5) 0%, rgba(148,187,233,0.5) 100%)",
                    },
                    p: 3,
                  }}
                  onClick={async () =>
                    selectedProfiles.forEach(profile => {
                      invoke("open_window", { profileId: profile })
                    })
                  }
                >
                  Launch
                </Button>

                <IconButton onClick={handleClick} variant="plain">
                  <ArrowDropDownOutlined />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem
                    variant="soft"
                    onClick={async () => {
                      profiles.forEach(profile => {
                        invoke("open_window", { profileId: profile })
                      })
                      handleClose();
                    }}
                  >
                    Open all profiles
                  </MenuItem>
                </Menu>
              </Grid>
              <Grid container justifyContent="center">
                <Card sx={{ backdropFilter: "blur(10px)" }} variant="outlined">
                  <Grid container direction="column" spacing={1}>
                    <Grid>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={4}
                      >
                        <Grid>
                          <Typography level="h4">Profiles</Typography>
                        </Grid>
                        <Grid>
                          <Tooltip
                            title="Add a profile"
                            arrow
                            open={!profiles?.length}
                          >
                            <AddProfileButton
                              profiles={profiles}
                              getProfiles={getProfiles}
                            />
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Divider />
                    </Grid>
                    <Grid>
                      <List>
                        {profiles?.length ? (
                          profiles.map((profile) => (
                            <ListItemButton
                              onClick={() => toggleSelectedProfile(profile)}
                              selected={selectedProfiles.includes(profile)}
                            >
                              <ListItemContent>
                                {profile.replace("profile_", "")}
                              </ListItemContent>
                              <IconButton
                                variant="outlined"
                                color="danger"
                                onClick={async () => {
                                  await invoke("delete_profile", {
                                    profileId: profile.replace("profile_", ""),
                                  });
                                  await getProfiles();
                                }}
                              >
                                <DeleteForeverOutlined />
                              </IconButton>
                            </ListItemButton>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemContent>
                              No profiles added yet.
                            </ListItemContent>
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;
