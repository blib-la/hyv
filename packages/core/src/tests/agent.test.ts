import type { SideEffect } from "@hyv/utils";

import { Agent } from "../agent.js";
import type { AgentOptions, ModelAdapter, ModelMessage } from "../types.js";

jest.spyOn(console, "log");

describe("Agent", () => {
	let agent: Agent;

	const dummyModel: ModelAdapter<ModelMessage> = {
		assign: jest.fn(message => Promise.resolve(message)),
	};

	beforeEach(() => {
		agent = new Agent(dummyModel);
	});

	it("should instantiate with correct defaults", () => {
		expect(agent.model).toBe(dummyModel);
		expect(agent.sideEffects).toEqual([]);
		expect(agent.before).toBeDefined();
		expect(agent.after).toBeDefined();
		expect(agent.finally).toBeDefined();
	});

	it("should instantiate with correct options", () => {
		const sideEffects: SideEffect[] = [{ prop: "test", run: jest.fn() }];
		const before: AgentOptions["before"] = async message => ({ ...message, before: true });
		const after: AgentOptions["after"] = async message => ({ ...message, after: true });
		const final: AgentOptions["finally"] = async <T extends ModelMessage>(id, message) => ({
			id,
			message: message as T,
		});

		agent = new Agent(dummyModel, { sideEffects, before, after, finally: final });

		expect(agent.model).toBe(dummyModel);
		expect(agent.sideEffects).toBe(sideEffects);
		expect(agent.before).toBe(before);
		expect(agent.after).toBe(after);
		expect(agent.finally).toBe(final);
	});

	it("should instantiate with correct defaults", () => {
		expect(agent.model).toBe(dummyModel);
		expect(agent.sideEffects).toEqual([]);
	});

	it("should set and get sideEffects", () => {
		const sideEffects: SideEffect[] = [{ prop: "test", run: jest.fn() }];
		agent.sideEffects = sideEffects;
		expect(agent.sideEffects).toBe(sideEffects);
	});

	// Similarly for 'before', 'after', 'finally' and 'model' properties

	describe("findSideEffect", () => {
		it("should find a sideEffect with the specified property", () => {
			const sideEffect: SideEffect = { prop: "test", run: jest.fn() };
			agent.sideEffects = [sideEffect];
			expect(agent.findSideEffect("test")).toBe(sideEffect);
		});
	});

	describe("assign", () => {
		it("should assign a message to the store", async () => {
			const message: ModelMessage = { text: "Test message" };
			const { id } = await agent.assign(message);
			expect(id).toBeDefined();
		});

		it("should use side effect when available and handle property logging based on type", async () => {
			// Arrange
			const message: ModelMessage = {
				text: "Test message",
				testProp: "test value",
				details: { key1: "value1", key2: "value2" },
				simpleDetails: "simple string",
			};
			const sideEffect: SideEffect = { prop: "testProp", run: jest.fn() };

			// Create agent with verbosity level 2 and side effect
			const agent = new Agent(dummyModel, { sideEffects: [sideEffect], verbosity: 2 });

			// Act
			await agent.assign(message);

			// Assert
			expect(sideEffect.run).toHaveBeenCalledWith("test value");
			expect(console.log).toHaveBeenCalledWith("Using side effect on: testProp");
		});
	});

	describe("do", () => {
		it("should retrieve and assign a message from the store", async () => {
			// Arrange
			const message: ModelMessage = { text: "Test message" };
			const { id } = await agent.assign(message); // We assume agent.assign works correctly

			// Mock model.assign to track its call
			const mockAssign = jest.fn(() => Promise.resolve(message));
			agent.model = { assign: mockAssign };

			// Act
			const resultId = await agent.do(id);

			// Assert
			expect(resultId).toBeDefined();
			expect(mockAssign).toHaveBeenCalledWith(message);
		});

		it("should throw error for non-existent message", async () => {
			// Arrange
			const nonExistentId = "non-existent-id";

			// Act & Assert
			await expect(agent.do(nonExistentId)).rejects.toThrow();
		});
	});

	describe("finally", () => {
		it("should get the finally function", () => {
			const agentFinally = agent.finally;
			expect(typeof agentFinally).toBe("function");
		});

		it("should set the finally function", () => {
			const newFinally = async <T extends ModelMessage>(id, message) => ({
				id,
				message: message as T,
			});
			agent.finally = newFinally;
			expect(agent.finally).toBe(newFinally);
		});
	});

	describe("before", () => {
		it("should get the before function", () => {
			const agentBefore = agent.before;
			expect(typeof agentBefore).toBe("function");
		});

		it("should set the before function", () => {
			const newBefore = async message => ({ ...message, before: true });
			agent.before = newBefore;
			expect(agent.before).toBe(newBefore);
		});
	});

	describe("after", () => {
		it("should get the after function", () => {
			const agentAfter = agent.after;
			expect(typeof agentAfter).toBe("function");
		});

		it("should set the after function", () => {
			const newAfter = async message => ({ ...message, after: true });
			agent.after = newAfter;
			expect(agent.after).toBe(newAfter);
		});
	});

	describe("assign", () => {
		it("should assign a message to the store and log based on verbosity", async () => {
			const message: ModelMessage = { text: "Test message" };

			// Agent with verbosity level 1
			const agent = new Agent(dummyModel, { verbosity: 1 });

			// Execute method
			const { id } = await agent.assign(message);

			expect(id).toBeDefined();
			// Depending on the message, the number of calls to console.log may vary
			expect(console.log).toHaveBeenCalledTimes(1); // Change this as per your code

			// Reset the mocked function
			(console.log as jest.Mock).mockClear();

			// Agent with verbosity level 2
			const agent2 = new Agent(dummyModel, { verbosity: 2 });

			// Execute method
			const id2 = await agent2.assign(message);

			expect(id2).toBeDefined();
			// Again, change this as per your code
			expect(console.log).toHaveBeenCalledTimes(9); // Change this as per your code
		});
	});
});
