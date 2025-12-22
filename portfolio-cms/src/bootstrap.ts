// Bootstrap script to set permissions programmatically
import type { Core } from '@strapi/strapi';

export default {
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Wait for Strapi to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Get the Public role
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (!publicRole) {
        console.log('Public role not found');
        return;
      }

      // List of all content types we created
      const contentTypes = [
        'api::hero.hero',
        'api::professional-experience.professional-experience',
        'api::education.education',
        'api::core-competency.core-competency',
        'api::certification.certification',
        'api::tool-category.tool-category',
        'api::project.project',
        'api::research-publication.research-publication',
        'api::achievement.achievement',
        'api::contact-information.contact-information',
        'api::about.about',
        'api::soft-skill.soft-skill',
        'api::cv-section.cv-section',
      ];

      // Get all existing permissions
      const permissions = await strapi
        .query('plugin::users-permissions.permission')
        .findMany({
          where: {
            role: publicRole.id,
          },
        });

      // Create permissions for each content type
      for (const contentType of contentTypes) {
        // Check if permissions already exist
        const existingFind = permissions.find(
          (p) => p.action === `${contentType}.find` && p.role?.id === publicRole.id
        );
        const existingFindOne = permissions.find(
          (p) => p.action === `${contentType}.findOne` && p.role?.id === publicRole.id
        );

        // Create find permission if it doesn't exist
        if (!existingFind) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({
              data: {
                action: `${contentType}.find`,
                role: publicRole.id,
              },
            });
          console.log(`✅ Created permission: ${contentType}.find`);
        }

        // Create findOne permission if it doesn't exist
        if (!existingFindOne) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({
              data: {
                action: `${contentType}.findOne`,
                role: publicRole.id,
              },
            });
          console.log(`✅ Created permission: ${contentType}.findOne`);
        }
      }

      console.log('✅ All permissions set successfully!');
    } catch (error) {
      console.error('❌ Error setting permissions:', error);
    }
  },
};

