import { AddOutlined } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { invoke } from "@tauri-apps/api/tauri";
import { forwardRef, Ref, useCallback, useState } from "react";

export const AddProfileButton = forwardRef(
  (
    {
      profiles,
      getProfiles,
      ...rest
    }: {
      profiles: string[];
      getProfiles: () => Promise<void>;
    },
    ref: Ref<HTMLButtonElement>
  ) => {
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addProfile = useCallback(async (profileId) => {
      await invoke("create_profile", {
        profileId,
      });

      await getProfiles();
    }, []);

    return (
      <>
        <IconButton
          {...rest}
          ref={ref}
          onClick={() => {
            setError(null);
            return setOpen(true);
          }}
        >
          <AddOutlined />
        </IconButton>
        <Modal
          open={open}
          onClose={() => {
            return setOpen(false);
          }}
        >
          <ModalDialog
            aria-labelledby="basic-modal-dialog-title"
            aria-describedby="basic-modal-dialog-description"
            sx={{ maxWidth: 500 }}
          >
            <Typography id="basic-modal-dialog-title" component="h2">
              Create new profile
            </Typography>
            <Typography
              id="basic-modal-dialog-description"
              textColor="text.tertiary"
            >
              Fill in the name for the profile. Must be unique.
            </Typography>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const target = e.target as typeof e.target & {
                  name: { value: string };
                  //password: { value: string };
                };

                const name = target?.name?.value;

                if (!name) {
                  return setError("Name is required");
                }
                console.log("name", name);
                console.log("profiles", profiles);
                console.log(
                  profiles.some((profile) => {
                    console.log("profile", profile);
                    console.log(
                      "profile.replace",
                      profile.replace("profile_", "")
                    );
                    console.log("name", name);
                    return profile.replace("profile_", "") === name;
                  })
                );

                if (
                  profiles.some(
                    (profile) => profile.replace("profile_", "") === name
                  )
                ) {
                  return setError("Profile already exists");
                }

                addProfile(target.name.value);
                setOpen(false);
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" autoFocus required error={!!error} />
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
                <Button type="submit">Create</Button>
              </Stack>
            </form>
          </ModalDialog>
        </Modal>
      </>
    );
  }
);

export default AddProfileButton;
