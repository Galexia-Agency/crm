import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFacebookF, faGithub, faDigitalOcean, faGoogleDrive } from '@fortawesome/free-brands-svg-icons'
import { faEdit, faBoxArchive, faBars, faGrip, faTrashCan, faCalendarAlt, faSync, faAddressCard, faPlus, faEllipsisH, faAngleRight, faEnvelope, faPhone, faSortUp, faSortDown, faTasks, faCalculator, faDesktop, faSignInAlt, faCloud } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEdit, faBoxArchive, faBars, faGrip, faTrashCan, faCalendarAlt, faSync, faAddressCard, faPlus, faEllipsisH, faAngleRight, faEnvelope, faPhone, faFacebookF, faGithub, faDigitalOcean, faGoogleDrive, faSortUp, faSortDown, faTasks, faCalculator, faDesktop, faSignInAlt, faCloud)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)
