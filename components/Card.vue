
<style lang="scss" scoped>
  .card {
    position: relative;
    border-radius: 3px;
    cursor: move
  }
  .card.icons_draggable {
    cursor: initial;
    .icons {
      display: none
    }
    .item-title {
      max-width: 100%
    }
  }
  .icons {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    display: grid;
    grid-gap: .5rem;
    grid-auto-flow: column
  }
  .is-overdue {
    color: red;
    border: 1px solid red
  }
  .card:hover {
    .icon-due,
    .icon-date {
      display: none
    }
  }
  .icon-edit, .icon-date {
    color: #DDDDDD
  }
  .icon-edit {
    display: none;
    margin-right: -5px;
    .card:hover & {
      display: block
    }
  }
  i {
    font-style: normal
  }
  @media (hover: none) {
    .card {
      .icon-due,
      .icon-date {
        display: none
      }
    }
    .icon-edit {
      .card & {
        display: block
      }
    }
  }
</style>

<template>
  <div class="card" :class="classes" :data-id="item.id">
    <div class="icons">
      <span v-if="!item.archived" class="icon icon-edit" @click="edit">
        <i class="fas fa-edit" />
      </span>
      <span v-else class="icon icon-edit" @click="unarchive">
        <i class="fas fa-edit" />
      </span>
      <span v-if="!item.archived" class="icon icon-edit" @click="archive">
        <i>&#10006;</i>
      </span>
      <span v-else class="icon icon-edit" @click="remove">
        <i>&#10006;</i>
      </span>
    </div>
    <div v-if="item">
      <a v-if="validURL(item.title)" class="item-title" target="_blank" :href="item.title" v-text="formatURL(item.title)" />
      <p v-else class="item-title" v-text="item.title" />
      <p v-if="item.description && item.description !== '<p></p>' && item.description !== ' '" class="item-description">
        &#x2630;
      </p>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    icons: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classes () {
      return {
        'is-due': this.isDue,
        'is-overdue': this.isOverdue,
        icons_draggable: !this.icons,
        archived: this.item.archived
      }
    },

    timestamp () {
      return Number(new Date(this.item.date))
    },

    isOverdue () {
      return this.timestamp && this.timestamp < Date.now()
    },

    isDue () {
      const date = this.timestamp
      const due = date - (1000 * 60 * 60 * 24) * 3
      const now = Date.now()
      return date > now && now > due
    }
  },

  methods: {
    edit () {
      this.$emit('edit', this.item)
    },
    unarchive () {
      this.$emit('unarchive', this.item)
    },
    archive () {
      this.$emit('archive', this.item)
    },
    remove () {
      this.$emit('remove', this.item)
    }
  }
}
</script>
