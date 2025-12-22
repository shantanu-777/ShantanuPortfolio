import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCvSectionItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_cv_section_items';
  info: {
    description: 'A section item in the CV preview';
    displayName: 'CV Section Item';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHighlight extends Struct.ComponentSchema {
  collectionName: 'components_shared_highlights';
  info: {
    description: 'Professional highlight item';
    displayName: 'Highlight';
  };
  attributes: {
    icon: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface SharedQuickFact extends Struct.ComponentSchema {
  collectionName: 'components_shared_quick_facts';
  info: {
    description: 'A quick fact statistic for CV section';
    displayName: 'Quick Fact';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    number: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media link';
    displayName: 'Social Link';
  };
  attributes: {
    icon: Schema.Attribute.String;
    platform: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedToolItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_tool_items';
  info: {
    description: 'Individual tool in a category';
    displayName: 'Tool Item';
  };
  attributes: {
    name: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.cv-section-item': SharedCvSectionItem;
      'shared.highlight': SharedHighlight;
      'shared.quick-fact': SharedQuickFact;
      'shared.social-link': SharedSocialLink;
      'shared.tool-item': SharedToolItem;
    }
  }
}
