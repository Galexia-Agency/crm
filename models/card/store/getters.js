export default {
  getCardById: () => (lists, cardId) => {
    const list = lists.find((list) => list.items.find((card) => card.id === cardId))
    if (list) {
      return list.items.find((card) => card.id === cardId)
    }
  }
}
