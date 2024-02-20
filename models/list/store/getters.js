export default {
  getById: () => (lists, listId) => {
    return lists.find((list) => list.id === listId)
  },
  getByCardId: () => (lists, cardId) => {
    return lists.find((list) => list.items.find((card) => card.id === cardId))
  }
}
