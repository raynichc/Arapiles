/* API file reference: https://www.gatsbyjs.com/docs/api-files-gatsby-config/
   This file is configuration passed to the Gatsby library in order to provide
   further functionality and customisation to this website.
*/

module.exports = {
  plugins: [
    /* SCSS transpiler and integration
    */
    `gatsby-plugin-sass`,

    /* Image processing
    */
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,

    /* File system object for data sourcing
       from files with GraphQL.
       Image content
       1) https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/
    */

    /* Get and Set Query Param
    */
    `gatsby-plugin-use-query-params`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    }
  ]
};
