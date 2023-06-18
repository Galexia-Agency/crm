<style scoped>
.list-container {
  display: inline-block;
  vertical-align: top
}
</style>

<template>
  <div class="board-container">
    <div class="board">
      <div class="lists-container">
        <DraggableContainer
          lock-axis="x"
          orientation="horizontal"
          drag-handle-selector=".list-container:not(.archived) .list-drag-handle"
          @drop="onListDrop"
          @drag-start="dragStartHandler()"
          @drag-end="dragEndHandler()"
        >
          <template v-for="(list, listIndex) in lists">
            <Draggable v-if="list.archived !== true || (showArchived && list.archived)" :key="`${list.id}_${list.archived}`">
              <section ref="list" class="list-container" :data-id="list.id" :class="{archived: list.archived}">
                <div v-if="project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email))" class="list-header">
                  <FontAwesomeIcon :icon="['fa-solid', 'fa-grip']" class="list-drag-handle" />
                  <input class="list-title" :value="list.title" @blur="updateList($event, list.id)">
                  <FontAwesomeIcon v-if="!list.archived" :icon="['fa-solid', 'fa-box-archive']" class="list-delete" @click="archiveList(list.id)" />
                  <template v-else>
                    <FontAwesomeIcon :icon="['fa-solid', 'fa-box-archive']" class="list-delete" @click="unarchiveList(list.id)" />
                    <FontAwesomeIcon v-if="project.admin.includes(userInfo.email)" :icon="['fa-solid', 'fa-trash-can']" class="list-delete" @click="removeList(list.id)" />
                  </template>
                </div>
                <div v-else class="list-header">
                  <p class="list-title" v-text="list.title" />
                </div>
                <DraggableContainer
                  v-if="project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email))"
                  group-name="list"
                  drag-class="card-ghost"
                  drop-class="card-ghost-drop"
                  non-drag-area-selector=".icon, .archived"
                  :animation-duration="100"
                  class="card-drop-area"
                  @drag-start="dragStartHandler()"
                  @drag-end="dragEndHandler()"
                  @drop="e => onCardDrop(e, list, listIndex)"
                >
                  <template v-for="card in list.items">
                    <Draggable v-if="!card.archived || (showArchived && card.archived)" :key="`${card.id}_${card.archived}_${card.date}_container`">
                      <KanbanCard
                        :key="`${card.id}_${card.archived}_${card.date}_component`"
                        :card="card"
                        :project="project"
                        @openUpdateModal="e => addOrUpdateCard({...e, more: true})"
                        @archive="archiveCard"
                        @unarchive="unarchiveCard"
                        @remove="removeCard"
                      />
                    </Draggable>
                  </template>
                </DraggableContainer>
                <template v-for="card in list.items" v-else>
                  <KanbanCard
                    v-if="!card.archived || (showArchived && card.archived)"
                    :key="`${card.id}_${card.archived}_${card.date}_component`"
                    :card="card"
                    :project="project"
                    @openUpdateModal="e => addOrUpdateCard({...e, more: true})"
                  />
                </template>
                <div class="card-entry">
                  <UiItemEntry
                    v-if="project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email))"
                    :list-id="list.id"
                    placeholder="Add an card"
                    icon="ellipsis-h"
                    @enter="addOrUpdateCard"
                  />
                </div>
              </section>
            </Draggable>
          </template>
          <div v-if="project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email))" class="new-list">
            <UiItemEntry placeholder="Add a list" @enter="addList" />
          </div>
        </DraggableContainer>
      </div>
    </div>
    <ModalsUpdateCard
      :key="`card_modal_${JSON.stringify(cardToUpdate)}`"
      :active="modalsUpdateCardActive"
      :project="project"
      :card="cardToUpdate"
      @submit="addOrUpdateCard"
      @archive="archiveCard"
      @cancel="hideUpdateCardModal"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Container as DraggableContainer, Draggable } from 'vue-smooth-dnd'

import { makeDropHandler } from '~/utils/plugins'

export default {
  components: {
    Draggable,
    DraggableContainer
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    showArchived: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      modalsUpdateCardActive: false,
      cardToUpdate: null
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    ...mapGetters([
      'getProjectById'
    ]),
    lists () {
      return this.getProjectById(this.project.id).lists
    }
  },
  methods: {
    /* Lists */
    async addList ({ text }) {
      await this.$store.dispatch('addList', { projectId: this.project.id, title: text })
      // Focus on the list entry
      this.$nextTick(() => {
        const lists = this.$refs.list
        lists[lists.length - 1]
          .querySelector('.card-entry input:last-of-type')
          .focus()
      })
    },
    onListDrop: makeDropHandler('onListDropComplete'),
    async onListDropComplete (src, trg) {
      await this.$store.dispatch('moveList', [
        this.project.id,
        src.index,
        trg.index
      ])
    },
    async updateList (event, id) {
      await this.$store.dispatch('updateList', { projectId: this.project.id, title: event.target.value, id })
    },
    async archiveList (listId) {
      await this.$store.dispatch('archiveList', { projectId: this.project.id, listId })
    },
    async unarchiveList (listId) {
      await this.$store.dispatch('unarchiveList', { projectId: this.project.id, listId })
    },
    async removeList (listId) {
      await this.$store.dispatch('removeList', { projectId: this.project.id, listId })
    },
    /* Cards */
    showUpdateCardModal (card) {
      this.cardToUpdate = card
      this.modalsUpdateCardActive = true
    },
    hideUpdateCardModal () {
      this.modalsUpdateCardActive = false
    },
    async addOrUpdateCard ({ card, text, listId, more }) {
      if (more) {
        this.modalsUpdateCardActive = true
        this.showUpdateCardModal(card)
        return
      }
      if (card && card.id) {
        await this.$store.dispatch('updateCard', {
          projectId: this.project.id,
          cardId: card.id,
          ...card
        })
      } else {
        await this.$store.dispatch('addCard', {
          projectId: this.project.id,
          listId,
          title: text
        })
      }
      this.hideUpdateCardModal()
    },
    async archiveCard (card) {
      // Update item first as we may have archived it from the modal
      await this.addOrUpdateCard({ card })
      await this.$store.dispatch('archiveCard', { projectId: this.project.id, cardId: card.id })
    },
    async unarchiveCard (item) {
      await this.$store.dispatch('unarchiveCard', { projectId: this.project.id, cardId: item.id })
    },
    async removeCard (item) {
      await this.$store.dispatch('removeCard', { projectId: this.project.id, cardId: item.id })
    },
    onCardDrop: makeDropHandler('onCardDropComplete'),
    async onCardDropComplete (src, trg) {
      await this.$store.dispatch('moveCard', [
        this.project.id,
        src.params[1],
        src.index,
        trg.params[1],
        trg.index
      ])
    }
  }
}
</script>
