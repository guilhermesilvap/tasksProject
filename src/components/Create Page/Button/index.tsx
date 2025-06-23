import colorsIcon from "../../../assets/colors.svg"
import styles from "./styles.module.css"

type Props = React.ComponentProps<"button">

export function Button({ ...rest }: Props) {
  return (
    <button className={styles.container} {...rest}>
      <img src={colorsIcon} alt="" />
    </button>
  )
}
