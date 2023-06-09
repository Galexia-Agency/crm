
<style lang="scss" scoped>
  .card {
    position: relative;
    border-radius: 3px;
    transition: background-color .25s ease-in-out;
    &:not(.archived) {
      &:hover,
      &:active,
      &:focus {
        background-color: rgb(225 225 225);
        cursor: pointer
      }
    }
    &.icons_draggable {
      cursor: initial;
      .icons {
        display: none
      }
      .item-title {
        max-width: 100%
      }
    }
    &.isnt_draggable {
      cursor: initial
    }
  }
  .icons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: grid;
    grid-auto-flow: column;
    gap: .5rem;
    cursor: pointer
  }
  .icon {
    width: 1.1rem;
    height: 1.1rem;
    transition: color .25s ease-in-out;
    &:hover {
      color: black
    }
  }
  .is-overdue {
    color: red;
    border: 1px solid red;
    .item-date {
      color: red
    }
  }
  .icon-edit {
    opacity: 0;
    .card:hover & {
      opacity: 1
    }
  }
  @media (hover: none) {
    .icon-edit {
      .card & {
        opacity: 1
      }
    }
  }
</style>

<template>
  <div class="card" :class="classes" :data-id="item.id" @click="edit">
    <div class="icons">
      <template v-if="icons && (project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email)))">
        <template v-if="item.archived">
          <font-awesome-icon :icon="['fa-solid', 'fa-box-archive']" class="icon icon-edit" @click.stop="unarchive" />
          <font-awesome-icon v-if="project.admin.includes(userInfo.email)" :icon="['fa-solid', 'fa-trash-can']" class="icon icon-edit" @click.stop="remove" />
        </template>
        <template v-else>
          <font-awesome-icon :icon="['fa-solid', 'fa-box-archive']" class="icon icon-edit" @click.stop="archive" />
        </template>
      </template>
    </div>
    <div v-if="item">
      <!-- Only put the first word through as a URL -->
      <p v-if="validURL(item.title.split(' ')[0])" class="item-title">
        <a target="_blank" :href="item.title.split(' ')[0]" v-text="formatURL(item.title.split(' ')[0])" />
        <span v-text="item.title.split(' ').slice(1).join(' ')" />
      </p>
      <p v-else class="item-title" v-text="item.title" />
      <p v-if="item.description && item.description !== '<p></p>' && item.description !== ' '">
        <font-awesome-icon :icon="['fa-solid', 'fa-bars']" />
      </p>
      <p v-if="item.date" class="item-date">
        <font-awesome-icon :icon="['fa-solid', 'fa-calendar-alt']" />
        {{ item.day + ' ' + item.dayNo + ' ' + item.month + ' - ' + daysRemaining(item.dateUNIX) }}
      </p>
      <p v-if="item.assignee && item.assignee !== userInfo.email" class="item-date">
        <font-awesome-icon :icon="['fa-solid', 'fa-user']" />
        {{ item.assignee }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    item: {
      type: Object,
      default: null
    },
    icons: {
      type: Boolean,
      default: true
    },
    project: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),

    classes () {
      return {
        'is-due': this.isDue,
        'is-overdue': this.isOverdue,
        icons_draggable: !this.icons,
        archived: this.item.archived,
        isnt_draggable: this.icons && !(this.project.admin.includes(this.userInfo.email) || (this.project.contributor && this.project.contributor.includes(this.userInfo.email)))
      }
    },

    isOverdue () {
      return this.item.dateUNIX && this.item.dateUNIX < Date.now()
    },

    isDue () {
      const date = this.item.dateUNIX
      const due = date - (1000 * 60 * 60 * 24) * 3
      const now = Date.now()
      return date > now && now > due
    }
  },

  methods: {
    edit () {
      if (!this.item.archived) {
        this.$emit('edit', this.item)
      }
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
