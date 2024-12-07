// <?xml version="1.0" encoding="UTF-8"?>
// <configuration>
//   <system.webServer>
//     <handlers>
//       <!-- Indicates that the server.js file is a node.js site to be handled by the iisnode module -->
//       <add name="iisnode" path="index.js" verb="*" modules="iisnode"/>
//     </handlers>
//     <rewrite>
//       <rules>
//         <!-- Redirect everything except files and API routes to index.html -->
//         <rule name="React App Routing" stopProcessing="true">
//           <match url=".*" />
//           <conditions logicalGrouping="MatchAll">
//             <!-- Exclude paths that begin with 'api/' -->
//             <add input="{REQUEST_URI}" pattern="^/api/" negate="true" />
//             <!-- Exclude requests for static files -->
//             <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
//             <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
//           </conditions>
//           <action type="Rewrite" url="/index.html" />
//         </rule>
//         <rule name="DynamicContent">
//           <conditions>
//             <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
//           </conditions>
//           <action type="Rewrite" url="index.js"/>
//         </rule>
//       </rules>
//     </rewrite>
//   </system.webServer>
// </configuration>



