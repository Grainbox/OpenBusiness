import { useGameStore } from '../../game/store/gameStore';
import { boardDefinition } from '../../game/board/boardDefinition';
import { getPropertyPrice } from '../../game/logic/buyProperty';
import styles from './BuyPropertyDialog.module.css';

export function BuyPropertyDialog() {
  const { propertyForSaleIndex, buyProperty, declineBuy } = useGameStore();

  if (propertyForSaleIndex === undefined) {
    return null;
  }

  const tile = boardDefinition.tiles[propertyForSaleIndex];
  const price = getPropertyPrice(propertyForSaleIndex);

  if (!tile || price === null) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2>Acheter une propriété ?</h2>
        <div className={styles.content}>
          <div className={styles.tileName}>{tile.name}</div>
          <div className={styles.price}>Prix : {price} €</div>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.acceptButton}
            onClick={() => buyProperty(propertyForSaleIndex)}
          >
            Acheter
          </button>
          <button className={styles.declineButton} onClick={declineBuy}>
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
