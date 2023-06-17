export function getListById (lists, listId) {
  return lists.find((list) => list.id === listId)
}

export function getListByCardId (lists, cardId) {
  return lists.find((list) => list.items.find((card) => card.id === cardId))
}

export function getCardById (lists, cardId) {
  const list = lists.find((list) => list.items.find((card) => card.id === cardId))
  if (list) {
    return list.items.find((card) => card.id === cardId)
  }
}
