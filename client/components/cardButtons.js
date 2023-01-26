import { Grid } from "@nextui-org/react";
import Bookmark from "./icons/bookmark";
import Checkmark from "./icons/checkmark";
import styles from "./cardButtons.module.css";

export default function CardButtons() {
  return (
    <>
      <Grid xs={12} justify="flex-end" className={styles.cardbuttons}>
        <Bookmark />
        <Checkmark />
      </Grid>
    </>
  );
}
