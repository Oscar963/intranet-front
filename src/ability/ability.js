// ability.js
import { AbilityBuilder, Ability } from "@casl/ability";

export const ability = new Ability([]);

export const defineAbilitiesFor = (user) => {
  const { can, build } = new AbilityBuilder(Ability);

  user.permissions.forEach((permission) => {
    const [action, subject] = permission.split(".");
    can(action, subject);
  });

  return build();
};

export const updateAbilities = (user) => {
  const newAbilities = defineAbilitiesFor(user);
  ability.update(newAbilities.rules);
};
