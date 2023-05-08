import type { Agent } from "./agent.js";
import { memoryStore } from "./memory-adapter.js";
import type { ModelAdapter, ModelMessage, StoreAdapter } from "./types.js";

/**
 * Runs a sequence of agents in a chain, passing the output of each agent as input to the next agent.
 * @param message
 * @param chain - An array of agents to be executed in sequence.
 * @param store - The store for the messages
 * @returns - The final message ID produced by the last agent in the chain.
 */
export async function sequence<Store extends StoreAdapter = StoreAdapter>(
	message: ModelMessage,
	chain: Agent<ModelAdapter<ModelMessage, ModelMessage>, Store>[],
	store = memoryStore
) {
	const featureId = await store.set(message);
	return chain.reduce(
		async (messageId, agent) => agent.do(await messageId),
		Promise.resolve(featureId)
	);
}
