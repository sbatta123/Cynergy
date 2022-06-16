const rootURL = 'http://localhost:10000';

const utils = {
  rootURL,
  getNameInitials(user) {
    const firstNameInitial = user.firstName ? user.firstName[0] : '';
    const lastNameInitial = user.lastName ? user.lastName[0] : '';
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  },

  getFullName(user) {
    return `${user.firstName} ${user.lastName}`;
  },

  getAffiliation(user) {
    return `${user.affiliation}`;
  },
};

export default utils;
