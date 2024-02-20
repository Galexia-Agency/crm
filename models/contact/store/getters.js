export default {
  // getById: (state) => (id) => {
  //   return state.all.find((item) => item.id === id)
  // },
  getContactsForClientById: (state) => (id) => {
    return state.all.filter((contact) => contact.client_id === id)
  }
}
