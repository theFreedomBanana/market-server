
const { ApolloServer } = require('@apollo/server');
const {startStandaloneServer} = require('@apollo/server/standalone');
const fs = require('fs');
const { randomUUID } = require('node:crypto');

const items = JSON.parse(fs.readFileSync("db.json", "utf8")).items;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
  type Item {
    tags: [String]
		price: Float!
		name: String!
		description: String
		slug: String!
		added: Float!
		manufacturer: String!
		itemType: String!
  }

	type Company {
		slug: String
		name: String
		address: String
		city: String
		state: String
		zip: String
		account: Float
		contact: String
	}

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each.
  type Query {
		item(filter: String, key: String, value: String): Item
    items: [Item]
    companies: [Company]
  }

	type Mutation {
		addItem(
			tags: [String]
			price: Float!
			name: String!
			description: String
			slug: String!
			manufacturer: String!
			itemType: String!
		): Item
	}
`

const resolvers = {
	Query: {
		item: (parent, args) => items.find(i => i.added === args.added),
		items: () => items,
		companies: () => companies,
	},
	Mutation: {
		addItem: (_, item, ...args) => {
			const newItem = {
				added: randomUUID().replaceAll('-', '').slice(0, 13),
				...item,
			}
			items.push(newItem);
			return item;
		}
	}
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {

	console.log(`🚀  Server ready at: ${url}`);
});

