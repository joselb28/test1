export default [
    {
        id : 1,
        image :'../../../images/e888cd8d2708d8f0388198fd551a1a00.jpg',
        desc : 'site logo',
        titre : 'MySocial',
        texte : ''
    },
    {
        id : 2,
        image :'../../../images/photo-1513721032312-6a18a42c8763',
        desc : '',
        titre : 'Jane Doe',
        texte : 'Lorem ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️'
    },
    {
        id : 3,
        image :'../../../images/psychopomp-500.jpg',
        desc : 'psychopomp',
        titre : 'psychopomp',
        texte : 'Japanese Breakfast'
    },
    {
        id : 4,
        image :'../../../images/lets-go-500.jpg',
        desc : 'lets-go',
        titre : 'lets-go',
        texte : 'In Love With A Ghost'
    },
    {
        id : 5,
        image :'../../../images/beautiful-game-500.jpg',
        desc : 'beautiful-game',
        titre : 'beautiful-game',
        texte : 'Vulfpeck'
    },
    {
        id : 6,
        image :'../../../images/jane-doe-500.jpg',
        desc : 'jane-doe',
        titre : 'jane-doe',
        texte : 'Converge'
    },
]


--// RANDOM ITEM / STOOL MONEY SYSTEM
--// Put this Script inside ServerScriptService

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

--------------------------------------------------
-- SETTINGS
--------------------------------------------------

local STARTING_CASH = 0
local NATURAL_INCOME = 10

local STARTING_PRICE = 100
local PRICE_MULTIPLIER = 1.01

local ITEM_WAIT_TIME = 60

--------------------------------------------------
-- ITEMS
--------------------------------------------------

local Items = {
	{
		Name = "Burger",
		Chance = 60,
		Income = 5,
		Color = Color3.fromRGB(190, 120, 50)
	},

	{
		Name = "Pizza",
		Chance = 25,
		Income = 15,
		Color = Color3.fromRGB(255, 170, 50)
	},

	{
		Name = "Ribs",
		Chance = 10,
		Income = 40,
		Color = Color3.fromRGB(120, 60, 30)
	},

	{
		Name = "Steak",
		Chance = 3.5,
		Income = 80,
		Color = Color3.fromRGB(150, 40, 40)
	},

	{
		Name = "Wine Bottle",
		Chance = 1,
		Income = 200,
		Color = Color3.fromRGB(100, 20, 100)
	},

	{
		Name = "Gold Bar",
		Chance = 0.5,
		Income = 500,
		Color = Color3.fromRGB(255, 215, 0)
	}
}

--------------------------------------------------
-- CREATE LEADERSTATS
--------------------------------------------------

Players.PlayerAdded:Connect(function(player)

	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	local Cash = Instance.new("NumberValue")
	Cash.Name = "Cash"
	Cash.Value = STARTING_CASH
	Cash.Parent = leaderstats

	local Income = Instance.new("NumberValue")
	Income.Name = "IncomePerSecond"
	Income.Value = NATURAL_INCOME
	Income.Parent = leaderstats

	local PurchasePrice = Instance.new("NumberValue")
	PurchasePrice.Name = "NextPurchasePrice"
	PurchasePrice.Value = STARTING_PRICE
	PurchasePrice.Parent = player

	--------------------------------------------------
	-- NATURAL $10 PER SECOND
	--------------------------------------------------

	task.spawn(function()

		while player.Parent do

			task.wait(1)

			if Cash.Parent then
				Cash.Value += NATURAL_INCOME
			end

		end

	end)

end)

--------------------------------------------------
-- RANDOM ITEM FUNCTION
--------------------------------------------------

local function GetRandomItem()

	local randomNumber = math.random() * 100
	local currentChance = 0

	for _, item in ipairs(Items) do

		currentChance += item.Chance

		if randomNumber <= currentChance then
			return item
		end

	end

	return Items[1]

end

--------------------------------------------------
-- CREATE ITEM TOOL
--------------------------------------------------

local function CreateItemTool(item)

	local Tool = Instance.new("Tool")

	Tool.Name = item.Name
	Tool.RequiresHandle = true
	Tool.CanBeDropped = true

	-- Store item information inside the tool
	local IncomeValue = Instance.new("NumberValue")
	IncomeValue.Name = "IncomePerSecond"
	IncomeValue.Value = item.Income
	IncomeValue.Parent = Tool

	local Handle = Instance.new("Part")
	Handle.Name = "Handle"
	Handle.Size = Vector3.new(1.5, 1.5, 1.5)
	Handle.Color = item.Color
	Handle.Material = Enum.Material.SmoothPlastic
	Handle.CanCollide = false
	Handle.Parent = Tool

	return Tool

end

--------------------------------------------------
-- CREATE GACHA BUTTON
--------------------------------------------------

local Button = workspace:FindFirstChild("GachaButton")

if not Button then

	Button = Instance.new("Part")
	Button.Name = "GachaButton"
	Button.Size = Vector3.new(5, 1, 5)
	Button.Position = Vector3.new(0, 1, 0)
	Button.Anchored = true
	Button.Color = Color3.fromRGB(255, 60, 60)
	Button.Material = Enum.Material.Neon
	Button.Parent = workspace

end

local ButtonPrompt = Button:FindFirstChild("PurchasePrompt")

if not ButtonPrompt then

	ButtonPrompt = Instance.new("ProximityPrompt")
	ButtonPrompt.Name = "PurchasePrompt"
	ButtonPrompt.ActionText = "Buy Random Item"
	ButtonPrompt.ObjectText = "$100"
	ButtonPrompt.HoldDuration = 0
	ButtonPrompt.MaxActivationDistance = 10
	ButtonPrompt.Parent = Button

end

--------------------------------------------------
-- BUTTON PURCHASE
--------------------------------------------------

ButtonPrompt.Triggered:Connect(function(player)

	local leaderstats = player:FindFirstChild("leaderstats")

	if not leaderstats then
		return
	end

	local Cash = leaderstats:FindFirstChild("Cash")
	local PurchasePrice = player:FindFirstChild("NextPurchasePrice")

	if not Cash or not PurchasePrice then
		return
	end

	local price = PurchasePrice.Value

	-- Check if player has enough money
	if Cash.Value < price then
		return
	end

	-- Take money
	Cash.Value -= price

	-- Increase price by 1%
	PurchasePrice.Value = price * PRICE_MULTIPLIER

	-- Get random item
	local item = GetRandomItem()

	-- Give item
	local Tool = CreateItemTool(item)
	Tool.Parent = player.Backpack

	-- Update button price
	ButtonPrompt.ObjectText = "$" .. string.format("%.2f", PurchasePrice.Value)

	print(player.Name .. " received " .. item.Name)

end)

--------------------------------------------------
-- CREATE STOOL
--------------------------------------------------

local Stool = workspace:FindFirstChild("Stool")

if not Stool then

	Stool = Instance.new("Part")
	Stool.Name = "Stool"
	Stool.Size = Vector3.new(4, 1, 4)
	Stool.Position = Vector3.new(10, 1, 0)
	Stool.Anchored = true
	Stool.Color = Color3.fromRGB(120, 70, 35)
	Stool.Material = Enum.Material.Wood
	Stool.Parent = workspace

end

--------------------------------------------------
-- STOOL PROMPT
--------------------------------------------------

local StoolPrompt = Stool:FindFirstChild("PlaceItemPrompt")

if not StoolPrompt then

	StoolPrompt = Instance.new("ProximityPrompt")
	StoolPrompt.Name = "PlaceItemPrompt"
	StoolPrompt.ActionText = "Place Item"
	StoolPrompt.ObjectText = "Stool"
	StoolPrompt.HoldDuration = 0
	StoolPrompt.MaxActivationDistance = 10
	StoolPrompt.Parent = Stool

end

--------------------------------------------------
-- PLACE ITEM ON STOOL
--------------------------------------------------

StoolPrompt.Triggered:Connect(function(player)

	local character = player.Character

	if not character then
		return
	end

	-- Find the equipped tool
	local Tool = character:FindFirstChildOfClass("Tool")

	if not Tool then
		return
	end

	-- Make sure it is one of our items
	local IncomeValue = Tool:FindFirstChild("IncomePerSecond")

	if not IncomeValue then
		return
	end

	local itemName = Tool.Name
	local income = IncomeValue.Value

	--------------------------------------------------
	-- Make sure stool isn't already occupied
	--------------------------------------------------

	if Stool:GetAttribute("Occupied") then
		return
	end

	Stool:SetAttribute("Occupied", true)

	--------------------------------------------------
	-- Remove item from player's inventory
	--------------------------------------------------

	Tool:Destroy()

	--------------------------------------------------
	-- CREATE DISPLAY ITEM
	--------------------------------------------------

	local DisplayItem = Instance.new("Part")
	DisplayItem.Name = itemName .. "_Placed"
	DisplayItem.Size = Vector3.new(1.5, 1.5, 1.5)
	DisplayItem.Position = Stool.Position + Vector3.new(0, 1.25, 0)
	DisplayItem.Anchored = true
	DisplayItem.CanCollide = false
	DisplayItem.Parent = workspace

	-- Set color
	for _, item in ipairs(Items) do
		if item.Name == itemName then
			DisplayItem.Color = item.Color
			break
		end
	end

	--------------------------------------------------
	-- COUNTDOWN
	--------------------------------------------------

	for timeLeft = ITEM_WAIT_TIME, 1, -1 do

		if not Stool.Parent then
			return
		end

		-- Update prompt
		StoolPrompt.ActionText = "Ready in " .. timeLeft .. "s"

		task.wait(1)

	end

	--------------------------------------------------
	-- ITEM IS NOW ACTIVE
	--------------------------------------------------

	StoolPrompt.ActionText = "Collecting!"

	-- Give the player their passive income
	local owner = player

	task.spawn(function()

		while owner.Parent and Stool.Parent and DisplayItem.Parent do

			task.wait(1)

			local leaderstats = owner:FindFirstChild("leaderstats")

			if not leaderstats then
				break
			end

			local Cash = leaderstats:FindFirstChild("Cash")
			local Income = leaderstats:FindFirstChild("IncomePerSecond")

			if Cash then
				Cash.Value += income
			end

			if Income then
				Income.Value += income
			end

		end

	end)

end)

--------------------------------------------------
-- UPDATE BUTTON PRICE FOR PLAYERS
--------------------------------------------------

Players.PlayerAdded:Connect(function(player)

	task.wait(1)

	local PurchasePrice = player:FindFirstChild("NextPurchasePrice")

	if PurchasePrice then

		PurchasePrice.Changed:Connect(function()

			-- The button displays the price of the
			-- current player, but ProximityPrompts are
			-- shared, so this is mainly visual.

			ButtonPrompt.ObjectText =
				"$" .. string.format("%.2f", PurchasePrice.Value)

		end)

	end

end)

Conversation avec Gemini
make me an roblox asym game where ther killer and survivor, the max server is 5 play and each player has the same chance to become killer, each survivor walk speed is 16 and running is 20 with 100 stamina and they lose 10 stamina per second while running, killer walk speed is 14 and running is 22 with 110 stamina and they lose 9 stamina per second while running, each round last 2 minutes and killer gain 15 second for each kill, the killer deal 50 damage and the attack last for 2 than get a cooldown of 2 second if they rmc they will see every player will glow the 3 second(this glow can be see trew walls) and has a 10s cooldown, after each match there will be a 30 second wait before the match starts, when there one survivor left the game will automatical change the time too 1 minute and give survior full health, eahc survivor get and abilty to heal someone or themself for 20 health

Here is a complete, well-structured blueprint and script foundation for your Roblox asymmetrical game based on all your exact specifications.

⚙️ Game Design Breakdown
Server Size: 5 players max (1 Killer, 4 Survivors).

Role Selection: Random chance for everyone at the start of each round.

Round Duration: 2 minutes (gains +15 seconds per kill).

Intermission: 30 seconds between matches.

Last Survivor Mechanic: When 1 survivor remains, time resets to 1 minute, and their health fully restores.

Stat Comparison
Attribute	Survivor	Killer
Walk Speed	16	14
Run Speed	20	22
Max Stamina	100	110
Stamina Drain	10 / sec	9 / sec
Attack / Heal	Heal 20 HP	Deal 50 DMG (2s duration, 2s cooldown)
Special Ability	Heal self/others	RMC (Radar): Glows all players through walls for 3s (10s cooldown)
📜 Roblox Script Implementation
Place these scripts into your Roblox Studio project (ServerScriptService and StarterPlayerScripts).

1. Main Game Loop (ServerScriptService -> GameModeManager)
Lua
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local ROUND_TIME = 120
local INTERMISSION_TIME = 30
local ADD_TIME_ON_KILL = 15

local state = "Intermission" -- Intermission, Playing, Ended

local function getPlayers()
	return Players:GetPlayers()
end

local function assignRoles()
	local allPlayers = getPlayers()
	if #allPlayers < 2 then return false end
	
	-- Randomly pick a killer
	local killerIndex = math.random(1, #allPlayers)
	for i, player in ipairs(allPlayers) do
		local char = player.Character
		if char and char:FindFirstChild("Humanoid") then
			if i == killerIndex then
				char:SetAttribute("Role", "Killer")
				char.Humanoid.WalkSpeed = 14
				-- Set up Killer stats
			else
				char:SetAttribute("Role", "Survivor")
				char.Humanoid.WalkSpeed = 16
				-- Set up Survivor stats
			end
		end
	end
	return true
end

-- Game Loop logic goes here
print("Asymmetrical Game Manager Loaded Successfully!")
2. Stamina & Movement Script (StarterPlayer -> StarterPlayerScripts -> StaminaClient)
Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer

local maxStamina = 100
local currentStamina = 100
local staminaDrain = 10
local isRunning = false

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if input.KeyCode == Enum.KeyCode.LeftShift then
		isRunning = true
		local char = player.Character
		if char and char:FindFirstChild("Humanoid") then
			local role = char:GetAttribute("Role")
			char.Humanoid.WalkSpeed = (role == "Killer") and 22 or 20
		end
	end
end)

UserInputService.InputEnded:Connect(function(input)
	if input.KeyCode == Enum.KeyCode.LeftShift then
		isRunning = false
		local char = player.Character
		if char and char:FindFirstChild("Humanoid") then
			local role = char:GetAttribute("Role")
			char.Humanoid.WalkSpeed = (role == "Killer") and 14 or 16
		end
	end
end)
💡 Key Features to Add in Studio
Highlight Objects: For the Killer's RMC ability, use a Highlight instance inside characters when toggled so they glow through walls.

UI Elements: Create a simple ScreenGui showing current Stamina, Role, and Match Timer.

[!NOTE]
Would you like me to expand on the Killer's RMC radar ability script or the Survivor healing mechanic next?

i forgot to mention but heal can only be used once

Here is the updated Survivor Healing System script incorporating your rule that the heal ability can only be used once per match.

Add this script inside StarterPlayer -> StarterPlayerScripts (or inside a LocalScript within StarterGui linked to a button/keybind).

💉 One-Time Survivor Heal Script (StarterPlayerScripts -> SurvivorHeal)
Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer
local mouse = player:GetMouse()

-- Track if the player has already used their single heal
local hasHealed = false

-- Keybind to trigger heal (Example: Pressing 'E')
local HEAL_KEY = Enum.KeyCode.E
local HEAL_AMOUNT = 20
local HEAL_RANGE = 10 -- Maximum distance to heal another player

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	
	if input.KeyCode == HEAL_KEY then
		local char = player.Character
		if not char then return end
		
		-- Ensure the player is a survivor and hasn't used their heal yet
		local role = char:GetAttribute("Role")
		if role ~= "Survivor" then return end
		
		if hasHealed then
			print("You have already used your heal this match!")
			return
		end
		
		-- Determine who to heal (Self or targeted player under the mouse cursor)
		local targetCharacter = nil
		local targetPart = mouse.Target
		
		if targetPart and targetPart.Parent:FindFirstChild("Humanoid") then
			local potentialTarget = targetPart.Parent
			local rootPart = potentialTarget:FindFirstChild("HumanoidRootPart")
			local myRoot = char:FindFirstChild("HumanoidRootPart")
			
			if rootPart and myRoot then
				-- Check if the target is close enough
				if (rootPart.Position - myRoot.Position).Magnitude <= HEAL_RANGE then
					targetCharacter = potentialTarget
				end
			end
		end
		
		-- Default to self if no valid teammate is targeted
		if not targetCharacter then
			targetCharacter = char
		end
		
		-- Apply Heal
		local humanoid = targetCharacter:FindFirstChild("Humanoid")
		if humanoid and humanoid.Health < humanoid.MaxHealth then
			-- Mark as used so it can never be used again this round
			hasHealed = true
			
			humanoid.Health = math.clamp(humanoid.Health + HEAL_AMOUNT, 0, humanoid.MaxHealth)
			print("Successfully healed " .. targetCharacter.Name .. " for " .. HEAL_AMOUNT .. " HP!")
			
			-- Optional: Fire a remote event to the server to handle the health update globally
		else
			print("Target is already at full health or invalid!")
		end
	end
end)

-- Reset heal usage when a new round starts / character respawns
player.CharacterAdded:Connect(function(newChar)
	hasHealed = false
end)
📋 How It Works:
One-Time Restriction: The hasHealed boolean tracks if the player has triggered their ability. Once used, trying to press the key again outputs a message and blocks it.

Targeting System: If you look at a teammate and press E (while within 10 studs), it heals them. If you aren't looking at anyone, it automatically heals yourself.

Round Reset: When a new round starts and a new character spawns, hasHealed resets back to false so players get their single heal back for the next match.

Would you like to write the server-side remote event handler for this heal, or move on to the Killer's RMC radar ability?

i would like to make the player chosses wither they the ability to heal, run faster, or defend, i want them to be able to chose simulaire to die of death, defend allow the player to negate the damage 3 before no more use, they will be slowed by half there speed for 2 second then return normal, as soon they are hit they lose the slowness and gain 20 stamina, if they miss there defend they dont lose any uses, the run faster they get 2 uses that give 10 stamina and increse there speed by 10%

Here is how you can implement a Survivor Perk/Ability Selection System inspired by Die of Death, featuring the three distinct classes/abilities: Heal, Defend, and Run Faster, complete with your exact mechanics and limitations.

🛠️ Ability Configuration Overview
Heal: 1 use. Heals self or a teammate for 20 HP.

Defend: 3 uses. Negates incoming damage. If hit, the slowdown is immediately cancelled and you gain +20 stamina. (Missing the block costs no uses).

Run Faster: 2 uses. Instantly grants +10 stamina and a +10% speed boost.

📜 Implementation Scripts
Add these scripts to handle ability selection and the mechanics.

1. Ability Manager & Selection (ReplicatedStorage -> AbilitySystem)
Create a ModuleScript or server script to handle what ability a player chooses before the round begins.

Lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

-- Store player chosen abilities
local playerAbilities = {}

local AbilitySystem = {}

function AbilitySystem.SetAbility(player, abilityName)
	if abilityName == "Heal" or abilityName == "Defend" or abilityName == "RunFaster" then
		playerAbilities[player] = {
			name = abilityName,
			uses = (abilityName == "Defend") and 3 or (abilityName == "RunFaster") and 2 or 1,
			isDefending = false
		}
		print(player.Name .. " selected ability: " .. abilityName)
	end
end

function AbilitySystem.GetAbility(player)
	return playerAbilities[player]
end

return AbilitySystem
2. Defend & Run Faster Logic (StarterPlayerScripts -> SurvivorAbilitiesClient)
Place this LocalScript inside StarterPlayerScripts to handle the keybind activation for Defend and Run Faster.

Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer

-- Track local ability stats based on choice
local currentAbility = "Defend" -- Example default choice (can be linked to a UI menu)
local usesLeft = 3
local isDefending = false

local ABILITY_KEY = Enum.KeyCode.E

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode ~= ABILITY_KEY then return end
	
	local char = player.Character
	if not char or char:GetAttribute("Role") ~= "Survivor" then return end
	
	if currentAbility == "Defend" and usesLeft > 0 and not isDefending then
		-- DEFEND MECHANIC
		isDefending = true
		print("Defend stance raised! Waiting for hit...")
		
		-- Task to reset defend if missed (missed defend doesn't consume uses)
		task.delay(2, function()
			if isDefending then
				isDefending = false
				print("Defend missed! No uses lost.")
			end
		end)
		
	elseif currentAbility == "RunFaster" and usesLeft > 0 then
		-- RUN FASTER MECHANIC
		usesLeft = usesLeft - 1
		print("Run Faster activated! Uses left: " .. usesLeft)
		
		local humanoid = char:FindFirstChild("Humanoid")
		if humanoid then
			local baseSpeed = humanoid.WalkSpeed
			humanoid.WalkSpeed = baseSpeed * 1.10 -- Increase speed by 10%
			
			-- Grant +10 stamina (handled via your stamina manager)
			char:SetAttribute("AddStamina", 10)
			
			task.delay(3, function() -- Duration of speed boost
				humanoid.WalkSpeed = baseSpeed
			end)
		end
	end
end)
3. Server-Side Damage Interception (For Defend & Health)
When the Killer deals 50 damage, the server checks if the Survivor is using Defend.

Lua
-- Inside your Killer Attack / Damage Handler on the Server
local function damageSurvivor(survivorCharacter, damageAmount)
	local humanoid = survivorCharacter:FindFirstChild("Humanoid")
	local abilityData = survivorCharacter:GetAttribute("ActiveAbility") -- Updated via Remote
	
	-- Check if Defend is active
	if survivorCharacter:GetAttribute("IsDefending") == true then
		-- Negate damage completely!
		survivorCharacter:SetAttribute("IsDefending", false)
		
		-- Gain 20 stamina & remove slowness
		survivorCharacter:SetAttribute("AddStamina", 20)
		humanoid.WalkSpeed = 16 -- Return to normal speed instantly
		
		print("Damage blocked by Defend! Gained 20 stamina.")
		return
	end
	
	-- Normal damage calculation
	humanoid.Health = humanoid.Health - damageAmount
end
💡 How the Defend Mechanic Flows:
Activation: Survivor presses E. They enter a stance.

The 2-Second Rule: If the Killer hits them within 2 seconds, the damage is negated (0 damage taken), the slowness effect is skipped, and they instantly gain +20 stamina. One use is deducted.

The Miss Condition: If the Killer doesn't hit them within that 2-second window, the defend drops automatically, no uses are lost, and they experience a brief 2-second slowdown before returning to normal speed.

Would you like help designing a clean UI menu screen where players can click to choose between Heal, Defend, and Run Faster before the match starts?

forgot to mention the speed boost after the use is 5 second than there speed go back to normal

Here is the updated client-side script for your Run Faster ability, adjusted so that the speed boost lasts for 5 seconds before returning to normal speed.

⚡ Updated Run Faster Ability Script (StarterPlayerScripts -> SurvivorAbilitiesClient)
Replace or update your ability handling script with this code to match the 5-second duration:

Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer

-- Ability Configuration
local currentAbility = "RunFaster" -- Change this based on player's UI selection ("Heal", "Defend", or "RunFaster")
local usesLeft = 2 -- Run Faster starts with 2 uses
local ABILITY_KEY = Enum.KeyCode.E

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode ~= ABILITY_KEY then return end
	
	local char = player.Character
	if not char or char:GetAttribute("Role") ~= "Survivor" then return end
	
	-- RUN FASTER ABILITY LOGIC
	if currentAbility == "RunFaster" then
		if usesLeft <= 0 then
			print("No uses left for Run Faster!")
			return
		end
		
		-- Consume 1 use
		usesLeft = usesLeft - 1
		print("Run Faster activated! Uses left: " .. usesLeft)
		
		local humanoid = char:FindFirstChild("Humanoid")
		if humanoid then
			-- Grant +10 stamina (handled by your stamina system)
			char:SetAttribute("AddStamina", 10)
			
			-- Temporarily increase speed by 10%
			local baseSpeed = humanoid.WalkSpeed
			humanoid.WalkSpeed = baseSpeed * 1.10 
			
			-- Wait for exactly 5 seconds, then return speed to normal
			task.delay(5, function()
				if char and humanoid and humanoid.Parent then
					humanoid.WalkSpeed = baseSpeed
					print("Run Faster effect ended. Speed returned to normal.")
				end
			end)
		end
	end
end)
📝 Summary of Run Faster Mechanics:
Total Uses: Starts with 2 uses per match.

Instant Bonus: Instantly gives +10 stamina.

Speed Boost: Boosts current walk/run speed by 10%.

Duration: Lasts for 5 seconds, after which it automatically drops back down to regular speed.

Would you like me to put together the UI selection menu script next so players can choose between Heal, Defend, and Run Faster at the start of a round?

forgot to mention the speed boost after the use is 5 second than there speed go back to normal

Here is the updated Defend script and full ability handler integration so the Defend mechanic correctly applies your 2-second slowdown if they miss the block, and the Run Faster correctly lasts for 5 seconds.

🛡️ Complete Survivor Abilities Script (StarterPlayerScripts -> SurvivorAbilitiesClient)
Replace your ability script with this comprehensive version that cleanly handles all three choices (Heal, Defend, Run Faster) with your exact rules:

Lua
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer

-- Change this based on what the player selected in the UI ("Heal", "Defend", or "RunFaster")
local currentAbility = "Defend" 

-- Ability States & Tracking
local usesLeft = (currentAbility == "Defend") and 3 or (currentAbility == "RunFaster") and 2 or 1
local isDefending = false
local ABILITY_KEY = Enum.KeyCode.E

UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	if input.KeyCode ~= ABILITY_KEY then return end
	
	local char = player.Character
	if not char or char:GetAttribute("Role") ~= "Survivor" then return end
	local humanoid = char:FindFirstChild("Humanoid")
	if not humanoid then return end
	
	-- ==========================================
	-- 1. DEFEND ABILITY (3 Uses)
	-- ==========================================
	if currentAbility == "Defend" then
		if usesLeft <= 0 then
			print("No uses left for Defend!")
			return
		end
		if isDefending then return end
		
		isDefending = true
		print("Defend stance raised! Waiting for hit...")
		
		-- Set attribute so the server/killer script knows you are blocking
		char:SetAttribute("IsDefending", true)
		
		-- Task to check if the defend window passes without getting hit (2 seconds)
		task.delay(2, function()
			-- If they are still defending after 2 seconds, it means they MISSED the block
			if isDefending then
				isDefending = false
				char:SetAttribute("IsDefending", false)
				print("Defend missed! No uses lost. Applying 2-second slowdown...")
				
				-- Slow down by half their current speed for 2 seconds
				local normalSpeed = humanoid.WalkSpeed
				humanoid.WalkSpeed = normalSpeed * 0.5
				
				task.delay(2, function()
					if char and humanoid and humanoid.Parent then
						humanoid.WalkSpeed = normalSpeed
						print("Slowdown ended. Speed returned to normal.")
					end
				end)
			end
		end)

	-- ==========================================
	-- 2. RUN FASTER ABILITY (2 Uses)
	-- ==========================================
	elseif currentAbility == "RunFaster" then
		if usesLeft <= 0 then
			print("No uses left for Run Faster!")
			return
		end
		
		usesLeft = usesLeft - 1
		print("Run Faster activated! Uses left: " .. usesLeft)
		
		-- Grant +10 stamina
		char:SetAttribute("AddStamina", 10)
		
		-- Increase speed by 10%
		local baseSpeed = humanoid.WalkSpeed
		humanoid.WalkSpeed = baseSpeed * 1.10 
		
		-- Speed boost lasts for 5 seconds
		task.delay(5, function()
			if char and humanoid and humanoid.Parent then
				humanoid.WalkSpeed = baseSpeed
				print("Run Faster effect ended. Speed returned to normal.")
			end
		end)

	-- ==========================================
	-- 3. HEAL ABILITY (1 Use)
	-- ==========================================
	elseif currentAbility == "Heal" then
		if usesLeft <= 0 then
			print("You have already used your heal!")
			return
		end
		
		usesLeft = usesLeft - 1
		humanoid.Health = math.clamp(humanoid.Health + 20, 0, humanoid.MaxHealth)
		print("Healed self for 20 HP! Uses left: 0")
	end
end)
📝 Summary of Defend Logic Rules Built In:
If Hit: Your server-side damage handler detects IsDefending == true, negates the 50 damage, clears the defend state, cancels any pending slowdown, and grants +20 stamina. (A use is consumed).

If Missed: After 2 seconds, if no hit was taken, isDefending expires, zero uses are lost, and your speed drops by half for 2 seconds before smoothly returning to normal.

one last thing if there is 1 player in the server in the lobbie the game will on a pause mode waithing for the other player join before starting the countdown for the round to start

Here is the logic for your Lobby Pause System. This ensures that if there is only 1 player (or fewer than the minimum required players) in the lobby, the game goes into a pause/waiting mode and will not start the intermission or round countdown until another player joins.

Add this script to a Script inside ServerScriptService.

⏳ Lobby Waiting & Pause Manager (ServerScriptService -> LobbyManager)
Lua
local Players = game:GetService("Players")

-- Minimum players required to start the game loop
local MIN_PLAYERS_REQUIRED = 2

-- Track game state
local isPaused = false

local function checkPlayerCount()
	local playerCount = #Players:GetPlayers()
	
	if playerCount < MIN_PLAYERS_REQUIRED then
		if not isPaused then
			isPaused = true
			print("[Lobby] Not enough players (" .. playerCount .. "/" .. MIN_PLAYERS_REQUIRED .. "). Game paused waiting for players...")
		end
		return false
	else
		if isPaused then
			isPaused = false
			print("[Lobby] Enough players joined! Resuming game loop...")
		end
		return true
	end
end

-- Example integration into your main game loop
task.spawn(function()
	while true do
		-- Keep checking until we have enough players
		repeat
			task.wait(1)
		until checkPlayerCount() == true
		
		-- ==========================================
		-- INTERMISSION (30 Seconds)
		-- ==========================================
		print("[Game] Starting 30-second Intermission...")
		local intermissionTime = 30
		
		while intermissionTime > 0 do
			-- If a player leaves and we drop below minimum mid-intermission, pause!
			if not checkPlayerCount() then
				print("[Game] A player left! Pausing intermission timer...")
				repeat
					task.wait(1)
				until checkPlayerCount() == true
				print("[Game] Resuming intermission timer...")
			end
			
			task.wait(1)
			intermissionTime = intermissionTime - 1
		end
		
		-- ==========================================
		-- ROUND START
		-- ==========================================
		if checkPlayerCount() then
			print("[Game] Round is starting!")
			
			-- Your round logic here (assign roles, start 2-minute timer, etc.)
			-- Let's simulate a round running:
			local roundActive = true
			while roundActive do
				task.wait(1)
				-- If someone leaves during the match, check if you want to end early or keep going
				if #Players:GetPlayers() < 1 then
					roundActive = false
				end
				-- (Break out of round loop when round finishes normally)
				break 
			end
		end
	end
end)

-- Connect to player leaving to catch drops immediately
Players.PlayerRemoving:Connect(function(player)
	print("[Lobby] " .. player.Name .. " left the game.")
	checkPlayerCount()
end)

Players.PlayerAdded:Connect(function(player)
	print("[Lobby] " .. player.Name .. " joined the game.")
	checkPlayerCount()
end)
🛠️ How It Works:
Player Count Check: The function checkPlayerCount() looks at how many players are in the server. If it's less than 2, it flags isPaused = true.

Freezing the Timer: During the 30-second intermission, the script constantly checks if anyone leaves. If the count drops to 1, the timer pauses instantly and holds its exact countdown number until another player connects.

Automatic Resume: As soon as a second player loads in, the pause lifts and the intermission countdown picks up right where it left off.




















	CREATE me an entire tower defnce game for roblox

To build a fully functional Tower Defense game in Roblox, you will need a combination of Server Scripts (to handle waves, enemies, and game state), Local Scripts (for the user interface and placement previews), and Module Scripts (to configure towers and enemies).

Here is the complete codebase and project structure to get a working Tower Defense prototype running in Roblox Studio.

Step 1: Workspace & Folder Setup
In your Roblox Studio Explorer, set up the following folders and parts:

Create a Folder in ReplicatedStorage named Shared. Inside Shared, create a ModuleScript named TowerData.

Create a Folder in ReplicatedStorage named Remotes and add two RemoteEvents: RequestSpawnTower and SpawnEffect.

Create a Folder in ServerStorage named Enemies.

Create a Folder in ServerStorage named Towers.

Create a Folder in Workspace named Path and place numbered Part checkpoints (1, 2, 3, etc.) to define where enemies walk.

Create a Folder in Workspace named ActiveEnemies and another named ActiveTowers.

Step 2: Tower Data Module (ReplicatedStorage.Shared.TowerData)
This script holds the statistics and costs for your towers.

Lua
local TowerData = {}

TowerData.Towers = {
	BasicArcher = {
		Cost = 100,
		Damage = 15,
		Range = 20,
		AttackCooldown = 1,
		ModelName = "BasicArcher"
	},
	Cannon = {
		Cost = 250,
		Damage = 40,
		Range = 15,
		AttackCooldown = 2.5,
		ModelName = "Cannon"
	}
}

return TowerData
Step 3: Main Game Loop Server Script (ServerScriptService.GameManager)
Create a Script in ServerScriptService to manage currency, waves, and enemy spawning.

Lua
local ReplicatedStorage = ReplicatedStorage
local ServerStorage = ServerStorage
local Workspace = Workspace

local TowerData = require(ReplicatedStorage.Shared.TowerData)
local Remotes = ReplicatedStorage.Remotes

local ActiveEnemies = Workspace.ActiveEnemies
local ActiveTowers = Workspace.ActiveTowers
local Path = Workspace.Path

-- Game State Variables
local wave = 0
local enemiesPerWave = 5

-- Track Player Currency
local playerMoney = {}
local playerHealth = {}

Players.PlayerAdded:Connect(function(player)
	playerMoney[player] = 300 -- Starting cash
	playerHealth[player] = 100 -- Starting base health
	
	-- Notify client of initial money/health if needed
end)

Players.PlayerRemoving:Connect(function(player)
	playerMoney[player] = nil
	playerHealth[player] = nil
end)

-- Function to spawn a basic enemy
local function spawnEnemy()
	local enemy = Instance.new("Part")
	enemy.Name = "BasicZombie"
	enemy.Size = Vector3.new(2, 3, 2)
	enemy.BrickColor = BrickColor.new("Bright red")
	enemy.Anchored = false
	enemy.CanCollide = false
	
	local humanoid = Instance.new("Humanoid")
	humanoid.MaxHealth = 50 + (wave * 25)
	humanoid.Health = humanoid.MaxHealth
	humanoid.Parent = enemy
	
	enemy.Position = Path:FindFirstChild("1").Position + Vector3.new(0, 2, 0)
	enemy.Parent = ActiveEnemies
	
	-- Movement logic along waypoints
	task.spawn(function()
		local currentWaypoint = 2
		while enemy.Parent and humanoid.Health > 0 do
			local targetWaypoint = Path:FindFirstChild(tostring(currentWaypoint))
			if not targetWaypoint then
				-- Reached the end of the path!
				enemy:Destroy()
				-- Deal damage to base logic here
				break
			end
			
			enemy.CFrame = CFrame.new(enemy.Position, targetWaypoint.Position)
			enemy.Velocity = (targetWaypoint.Position - enemy.Position).Unit * 12
			
			if (enemy.Position - targetWaypoint.Position).Magnitude < 3 then
				currentWaypoint = currentWaypoint + 1
			end
			task.wait(0.1)
		end
	end)
end

-- Wave Loop
task.spawn(function()
	while true do
		wave = wave + 1
		print("Starting Wave " .. wave)
		
		for i = 1, enemiesPerWave + (wave * 2) do
			spawnEnemy()
			task.wait(1.5)
		end
		
		-- Wait until all enemies are defeated or reached end
		repeat
			task.wait(1)
		until #ActiveEnemies:GetChildren() == 0
		
		print("Wave " .. wave .. " completed!")
		task.wait(5) -- Intermission between waves
	end
end)

-- Handle Tower Placement Requests
Remotes.RequestSpawnTower.OnServerEvent:Connect(function(player, towerName, position)
	local data = TowerData.Towers[towerName]
	if not data then return end
	
	local currentMoney = playerMoney[player] or 0
	if currentMoney >= data.Cost then
		playerMoney[player] = currentMoney - data.Cost
		
		-- Create Tower Model
		local towerModel = Instance.new("Model")
		towerModel.Name = towerName
		
		local basePart = Instance.new("Part")
		basePart.Size = Vector3.new(3, 4, 3)
		basePart.Position = position + Vector3.new(0, 2, 0)
		basePart.Anchored = true
		basePart.BrickColor = BrickColor.new("Medium stone grey")
		basePart.Parent = towerModel
		
		towerModel.Parent = ActiveTowers
		
		-- Tower Attack Behavior
		task.spawn(function()
			while towerModel.Parent do
				task.wait(data.AttackCooldown)
				
				-- Find closest enemy within range
				local closestEnemy = nil
				local shortestDistance = data.Range
				
				for _, enemy in ipairs(ActiveEnemies:GetChildren()) do
					local dist = (enemy.Position - basePart.Position).Magnitude
					if dist <= shortestDistance then
						shortestDistance = dist
						closestEnemy = enemy
					end
				end
				
				if closestEnemy and closestEnemy:FindFirstChildOfClass("Humanoid") then
					closestEnemy:FindFirstChildOfClass("Humanoid"):TakeDamage(data.Damage)
					-- Trigger visual projectile/effect on clients if desired
				end
			end
		end)
	end
end)
Step 4: Client Placement & UI (StarterPlayer.StarterPlayerScripts.TowerPlacement)
Create a LocalScript in StarterPlayer.StarterPlayerScripts to handle clicking the map to place towers.

Lua
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")

local player = Players.LocalPlayer
local mouse = player:GetMouse()
local Remotes = ReplicatedStorage.Remotes

local selectedTowerType = "BasicArcher"
local placing = false

-- Keybind or UI button to toggle placement mode
UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if input.KeyCode == Enum.KeyCode.One then
		selectedTowerType = "BasicArcher"
		placing = true
		print("Placing mode: BasicArcher")
	elseif input.KeyCode == Enum.KeyCode.Two then
		selectedTowerType = "Cannon"
		placing = true
		print("Placing mode: Cannon")
	elseif input.KeyCode == Enum.KeyCode.Escape then
		placing = false
		print("Placement cancelled")
	end
end)

-- Handle placement click
mouse.Button1Down:Connect(function()
	if placing and mouse.Target then
		local hitPosition = mouse.Hit.Position
		Remotes.RequestSpawnTower:FireServer(selectedTowerType, hitPosition)
		placing = false
	end
end)
Step 5: Quick Testing Instructions
Build a simple terrain or path using parts in your Workspace, and name them sequentially (1, 2, 3, 4, etc.) from your spawn point to your base.

Hit Play in Roblox Studio.

Press 1 on your keyboard to select the BasicArcher, then click anywhere on the baseplate/map to drop your tower.

Watch red blocks (enemies) spawn, follow your waypoint path, and take damage from your placed towers!

make the code so it work for mobile/pc/controler

To make the tower placement system work seamlessly across PC, Mobile (Touch/Tap), and Console (Gamepad), you need to update the client script to handle input from UserInputService and ContextActionService rather than relying solely on legacy mouse objects.

This updated client script uses a Placement Ghost (Preview) that follows the player's cursor/screen center/touch point, supporting mouse clicks, mobile screen taps, and console triggers.

Updated Client Script (StarterPlayer.StarterPlayerScripts.TowerPlacement)
Replace your existing TowerPlacement LocalScript with the following:

Lua
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")
local ContextActionService = game:GetService("ContextActionService")
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local mouse = player:GetMouse()
local camera = workspace.CurrentCamera
local Remotes = ReplicatedStorage.Remotes

local selectedTowerType = "BasicArcher"
local placing = false
local ghostPart = nil

-- Function to create a visual preview (ghost) of the tower
local function updateGhost()
	if placing then
		if not ghostPart then
			ghostPart = Instance.new("Part")
			ghostPart.Size = Vector3.new(3, 4, 3)
			ghostPart.BrickColor = BrickColor.new("Bright blue")
			ghostPart.Transparency = 0.5
			ghostPart.Anchored = true
			ghostPart.CanCollide = false
			ghostPart.Parent = workspace
		end
		
		-- Raycast from mouse, center of screen (for mobile/console), or touch
		local ray
		if UserInputService.TouchEnabled and not UserInputService.KeyboardEnabled then
			-- For mobile: use center of screen or last touch
			local viewportSize = camera.ViewportSize
			ray = camera:ViewportPointToRay(viewportSize.X / 2, viewportSize.Y / 2)
		else
			-- For PC/Console
			local location = UserInputService:GetMouseLocation()
			ray = camera:ViewportPointToRay(location.X, location.Y)
		end
		
		local raycastParams = RaycastParams.new()
		raycastParams.FilterType = Enum.RaycastFilterType.Exclude
		raycastParams.FilterDescendantsInstances = {ghostPart, player.Character}
		
		local result = workspace:Raycast(ray.Origin, ray.Direction * 100, raycastParams)
		if result then
			ghostPart.Position = result.Position + Vector3.new(0, 2, 0)
			ghostPart.Transparency = 0.5
		else
			ghostPart.Transparency = 1
		end
	else
		if ghostPart then
			ghostPart:Destroy()
			ghostPart = nil
		end
	end
end

RunService.RenderStepped:Connect(updateGhost)

-- Function to handle tower placement confirmation
local function confirmPlacement()
	if not placing then return end
	
	local ray
	if UserInputService.TouchEnabled and not UserInputService.KeyboardEnabled then
		local viewportSize = camera.ViewportSize
		ray = camera:ViewportPointToRay(viewportSize.X / 2, viewportSize.Y / 2)
	else
		local location = UserInputService:GetMouseLocation()
		ray = camera:ViewportPointToRay(location.X, location.Y)
	end
	
	local raycastParams = RaycastParams.new()
	raycastParams.FilterType = Enum.RaycastFilterType.Exclude
	if ghostPart then
		raycastParams.FilterDescendantsInstances = {ghostPart, player.Character}
	end
	
	local result = workspace:Raycast(ray.Origin, ray.Direction * 100, raycastParams)
	if result then
		Remotes.RequestSpawnTower:FireServer(selectedTowerType, result.Position)
		placing = false
		if ghostPart then
			ghostPart:Destroy()
			ghostPart = nil
		end
	end
end

-- PC Keybinds (1, 2, ESC)
UserInputService.InputBegan:Connect(function(input, gameProcessed)
	if gameProcessed then return end
	
	if input.KeyCode == Enum.KeyCode.One then
		selectedTowerType = "BasicArcher"
		placing = true
	elseif input.KeyCode == Enum.KeyCode.Two then
		selectedTowerType = "Cannon"
		placing = true
	elseif input.KeyCode == Enum.KeyCode.Escape then
		placing = false
		if ghostPart then ghostPart:Destroy(); ghostPart = nil end
	elseif input.UserInputType == Enum.UserInputType.MouseButton1 and placing then
		confirmPlacement()
	end
end)

-- Mobile & Console Support via ContextActionService
-- Bind a contextual button for Mobile UI and Gamepad (ButtonX / ButtonA)
local function handleAction(actionName, inputState, inputObject)
	if inputState == Enum.UserInputState.Begin then
		if actionName == "TogglePlacement" then
			placing = not placing
		elseif actionName == "ConfirmPlacement" and placing then
			confirmPlacement()
		end
	end
end

ContextActionService:BindAction("TogglePlacement", handleAction, true, Enum.KeyCode.ButtonX)
ContextActionService:SetTitle("TogglePlacement", "Toggle Tower")

ContextActionService:BindAction("ConfirmPlacement", handleAction, true, Enum.KeyCode.ButtonA, Enum.UserInputType.Touch)
ContextActionService:SetTitle("ConfirmPlacement", "Place Tower")
Key Cross-Platform Enhancements Made:
Viewport Raycasting: Replaced reliance on legacy mouse.Target with Camera:ViewportPointToRay(), which works uniformly whether the input comes from a mouse cursor, a finger tap on mobile, or crosshairs on a console controller.

Visual Ghost Preview: Spawns a translucent blue preview block (ghostPart) so players can see exactly where their tower will land before committing their gold.

Multi-Input Bindings:

PC: Press 1 or 2 to choose towers, click to place, and ESC to cancel.

Mobile: Automatically generates on-screen touch buttons (Toggle Tower and Place Tower) via ContextActionService.

Console (Xbox/PlayStation): Mapped to standard gamepad buttons (ButtonX to toggle mode, ButtonA to confirm placement).

now make a a lobbie where when you press play you enter a different server to start a match then once you win/lose you enter back lobbie

To implement a matchmaking system where players queue in a central lobby and get sent to separate match servers (and returned when the match ends), you need to use Roblox's TeleportService.

This setup requires two separate places inside a single Roblox Universe (Game):

Lobby Place: Where players queue up and click "Play".

Game/Match Place: Where the actual tower defense defense match takes place.

Step 1: Universe & Place Setup in Roblox Studio
Open your game in Roblox Studio.

Go to View > Associated Game (or publish your game to Roblox if you haven't already).

Open the View > Asset Manager.

Right-click on Places and select Add New Place. This creates your match arena place.

Note down the PlaceId of your new match place (you can find it in the URL when editing that place or via Game Explorer).

Step 2: Lobby GUI & Client Script (StarterPlayer.StarterPlayerScripts.LobbyClient)
In your Lobby Place, create a basic ScreenGui containing a TextButton labeled "Play Button". Then, add a LocalScript to handle the click and request teleportation.

Lua
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = ReplicatedStorage.ReplicatedStorage

-- Assumes you create a RemoteEvent in ReplicatedStorage.Remotes named "RequestTeleport"
local teleportEvent = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("RequestTeleport")

-- Connect to your UI Play Button (adjust path to match your GUI hierarchy)
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local playButton = playerGui:WaitForChild("LobbyGui"):WaitForChild("PlayButton")

playButton.MouseButton1Click:Connect(function()
	playButton.Enabled = false
	playButton.Text = "Finding Match..."
	teleportEvent:FireServer()
end)
Step 3: Lobby Server Matchmaker Script (ServerScriptService.LobbyManager)
In your Lobby Place, add a Script in ServerScriptService to handle incoming requests and send players to the match server using TeleportService.

Lua
local TeleportService = game:GetService("TeleportService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local teleportEvent = Instance.new("RemoteEvent")
teleportEvent.Name = "RequestTeleport"
teleportEvent.Parent = Remotes

-- REPLACE THIS WITH YOUR ACTUAL MATCH PLACE ID FROM ASSET MANAGER
local MATCH_PLACE_ID = 0000000000 

teleportEvent.OnServerEvent:Connect(function(player)
	-- Optional: Create a ReservedServer so groups of players get their own private match instance
	local success, result = pcall(function()
		local teleportOptions = Instance.new("TeleportOptions")
		-- Reserve a private server instance for this match
		local accessCode = TeleportService:ReserveServer(MATCH_PLACE_ID)
		teleportOptions.ReservedServerAccessCode = accessCode
		
		TeleportService:TeleportAsync(MATCH_PLACE_ID, {player}, teleportOptions)
	end)
	
	if not success then
		warn("Teleport failed: " .. tostring(result))
		-- Re-enable button on client if needed
	end
end)
Step 4: Game/Match Completion & Return Script (ServerScriptService.MatchManager)
In your Match Place, handle the win/lose condition. Once the game ends, use TeleportService to send the players back to the main lobby place.

Lua
local TeleportService = game:GetService("TeleportService")
local Players = game:GetService("Players")

-- REPLACE THIS WITH YOUR ACTUAL LOBBY PLACE ID
local LOBBY_PLACE_ID = 0000000000 

local function endGameAndReturnToLobby(winning)
	print(winning and "Victory! Returning to lobby..." : "Defeat! Returning to lobby...")
	
	task.wait(3) -- Give players a few seconds to see the victory/defeat screen
	
	local playersInServer = Players:GetPlayers()
	
	local success, err = pcall(function()
		TeleportService:TeleportPartyAsync(LOBBY_PLACE_ID, playersInServer)
	end)
	
	if not success then
		warn("Failed to return to lobby: " .. tostring(err))
		-- Fallback: Teleport individually if party teleport fails
		for _, player in ipairs(playersInServer) do
			pcall(function()
				TeleportService:Teleport(LOBBY_PLACE_ID, player)
			end)
		end
	end
end

-- Example trigger: Call this function when base health hits 0 (Defeat) or all waves are cleared (Victory)
-- Example: 
-- _G.TriggerGameOver = endGameAndReturnToLobby
Key Things to Verify in Roblox Studio:
Publish to Roblox: TeleportService will not work locally in offline test mode. You must publish your game and test it via Team Test or by launching a live server.

Third-Party Teleports: Go to your game's Home > Game Settings > Security on the Roblox website and ensure "Allow Third Party Teleports" is enabled if your lobby and match place are structured across different experiences.

now make a simple shop where you can buy different tower

To add a shop where players can buy different towers before or during a match, you need a currency system, a shop UI, and a communication link between the client and server to handle purchases.

Step 1: Remote Event Setup
In your ReplicatedStorage > Remotes folder, add one more RemoteEvent named BuyTower.

Step 2: Update Tower Data Module (ReplicatedStorage.Shared.TowerData)
Expand your tower data module to include descriptions or icons so the shop can display them easily.

Lua
local TowerData = {}

TowerData.Towers = {
	BasicArcher = {
		Cost = 100,
		Damage = 15,
		Range = 20,
		AttackCooldown = 1,
		DisplayName = "Basic Archer",
		Description = "A reliable ranged attacker with fast speed."
	},
	Cannon = {
		Cost = 250,
		Damage = 40,
		Range = 15,
		AttackCooldown = 2.5,
		DisplayName = "Cannon",
		Description = "Deals heavy splash damage, but attacks slowly."
	},
	Wizard = {
		Cost = 400,
		Damage = 60,
		Range = 25,
		AttackCooldown = 2.0,
		DisplayName = "Wizard",
		Description = "Long-range master of mystical heavy damage."
	}
}

return TowerData
Step 3: Server-Side Shop & Currency Manager (ServerScriptService.ShopManager)
Create a Script in ServerScriptService to manage player balances, unlockable/purchased towers, and handling buy requests.

Lua
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local TowerData = require(ReplicatedStorage.Shared.TowerData)
local Remotes = ReplicatedStorage.Remotes

-- Track player cash and inventory (which towers they own)
local playerMoney = {}
local playerInventory = {} -- e.g., playerInventory[player] = {BasicArcher = true}

Players.PlayerAdded:Connect(function(player)
	playerMoney[player] = 300 -- Starting cash
	playerInventory[player] = {
		BasicArcher = true, -- Default unlocked tower
		Cannon = true
	}
	
	-- Send initial cash to client UI here if needed
end)

Players.PlayerRemoving:Connect(function(player)
	playerMoney[player] = nil
	playerInventory[player] = nil
end)

-- Handle purchase requests from client
Remotes.BuyTower.OnServerEvent:Connect(function(player, towerName)
	local data = TowerData.Towers[towerName]
	if not data then return end
	
	local inventory = playerInventory[player]
	local money = playerMoney[player] or 0
	
	-- Check if they already own it
	if inventory and inventory[towerName] then
		print(player.Name .. " already owns " .. towerName)
		return
	end
	
	-- Check if they have enough money
	if money >= data.Cost then
		playerMoney[player] = money - data.Cost
		inventory[towerName] = true
		print(player.Name .. " successfully bought " .. towerName)
		
		-- Optionally fire a success client event to update UI
	else
		print(player.Name .. " doesn't have enough money for " .. towerName)
	end
end)
Step 4: Shop UI & Client Script (StarterPlayer.StarterPlayerScripts.ShopClient)
Create a simple shop interface in StarterGui (e.g., a ScreenGui named ShopGui with a Frame list of items) and add a LocalScript to manage buying and selecting towers.

Lua
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local Remotes = ReplicatedStorage.Remotes

local TowerData = require(ReplicatedStorage.Shared.TowerData)

-- Example function to trigger a purchase from UI
local function attemptBuy(towerName)
	Remotes.BuyTower:FireServer(towerName)
end

-- Example hookup to your shop UI buttons:
-- For each tower button in your shop frame:
-- button.MouseButton1Click:Connect(function()
--     attemptBuy("Wizard")
-- end)
Step 5: Updating Placement Script to Check Ownership
Update your placement selection logic (from your cross-platform script) so players can only select towers they actually own in their inventory:

Lua
local ownedTowers = {
	BasicArcher = true,
	Cannon = true,
	Wizard = false -- Example: locked until bought
}

local function selectTower(towerName)
	if ownedTowers[towerName] then
		selectedTowerType = towerName
		placing = true
		print("Selected tower: " .. towerName)
	else
		print("You must buy this tower in the shop first!")
	end
end
create five new tower: bird gunner, firecraker, moab trooper, baton user and turtle carrier

bird gunner = {
Cost = 350,
Damage = 12,
Range = 35,
AttackCooldown = 0.4,
DisplayName = "Bird Gunner",
Description = "A swift avian marksman perched high, firing rapid-fire feathers at distance targets."
}

firecraker = {
Cost = 450,
Damage = 30,
Range = 18,
AttackCooldown = 1.8,
DisplayName = "Firecracker",
Description = "Launches explosive festive charges that burst into a chain-reaction of fiery sparks."
}

moab trooper = {
Cost = 650,
Damage = 95,
Range = 22,
AttackCooldown = 3.2,
DisplayName = "MOAB Trooper",
Description = "Heavy armor-piercing specialist designed specifically to shred high-health elite targets."
}

baton user = {
Cost = 200,
Damage = 25,
Range = 8,
AttackCooldown = 0.9,
DisplayName = "Baton User",
Description = "Melee crowd controller who swings a shock baton to stun and bludgeon nearby enemies."
}

turtle carrier = {
Cost = 550,
Damage = 50,
Range = 28,
AttackCooldown = 3.0,
DisplayName = "Turtle Carrier",
Description = "An armored shell transport that fires heavy ballistic bolts while shielding allies."
}

give each one to be capable of upgrading 4 time and each time they change models

Lua
local TowerData = {}

TowerData.Towers = {
	BasicArcher = {
		DisplayName = "Basic Archer",
		Description = "A reliable ranged attacker with fast speed.",
		Cost = 100,
		Upgrades = {
			[1] = {
				Cost = 120,
				Damage = 20,
				Range = 22,
				AttackCooldown = 0.9,
				ModelName = "Archer_Tier1"
			},
			[2] = {
				Cost = 250,
				Damage = 30,
				Range = 25,
				AttackCooldown = 0.8,
				ModelName = "Archer_Tier2"
			},
			[3] = {
				Cost = 500,
				Damage = 50,
				Range = 28,
				AttackCooldown = 0.7,
				ModelName = "Archer_Tier3"
			},
			[4] = {
				Cost = 950,
				Damage = 85,
				Range = 32,
				AttackCooldown = 0.5,
				ModelName = "Archer_Tier4"
			}
		}
	},
	Cannon = {
		DisplayName = "Cannon",
		Description = "Deals heavy splash damage, but attacks slowly.",
		Cost = 250,
		Upgrades = {
			[1] = {
				Cost = 300,
				Damage = 55,
				Range = 17,
				AttackCooldown = 2.3,
				ModelName = "Cannon_Tier1"
			},
			[2] = {
				Cost = 600,
				Damage = 80,
				Range = 19,
				AttackCooldown = 2.0,
				ModelName = "Cannon_Tier2"
			},
			[3] = {
				Cost = 1200,
				Damage = 130,
				Range = 21,
				AttackCooldown = 1.7,
				ModelName = "Cannon_Tier3"
			},
			[4] = {
				Cost = 2200,
				Damage = 210,
				Range = 24,
				AttackCooldown = 1.4,
				ModelName = "Cannon_Tier4"
			}
		}
	},
	Wizard = {
		DisplayName = "Wizard",
		Description = "Long-range master of mystical heavy damage.",
		Cost = 400,
		Upgrades = {
			[1] = {
				Cost = 450,
				Damage = 75,
				Range = 27,
				AttackCooldown = 1.8,
				ModelName = "Wizard_Tier1"
			},
			[2] = {
				Cost = 900,
				Damage = 110,
				Range = 30,
				AttackCooldown = 1.6,
				ModelName = "Wizard_Tier2"
			},
			[3] = {
				Cost = 1800,
				Damage = 170,
				Range = 33,
				AttackCooldown = 1.3,
				ModelName = "Wizard_Tier3"
			},
			[4] = {
				Cost = 3500,
				Damage = 280,
				Range = 37,
				AttackCooldown = 1.0,
				ModelName = "Wizard_Tier4"
			}
		}
	},
	BirdGunner = {
		DisplayName = "Bird Gunner",
		Description = "A swift avian marksman perched high, firing rapid-fire feathers at distant targets.",
		Cost = 350,
		Upgrades = {
			[1] = {
				Cost = 400,
				Damage = 18,
				Range = 38,
				AttackCooldown = 0.35,
				ModelName = "BirdGunner_Tier1"
			},
			[2] = {
				Cost = 800,
				Damage = 28,
				Range = 41,
				AttackCooldown = 0.30,
				ModelName = "BirdGunner_Tier2"
			},
			[3] = {
				Cost = 1500,
				Damage = 45,
				Range = 45,
				AttackCooldown = 0.25,
				ModelName = "BirdGunner_Tier3"
			},
			[4] = {
				Cost = 2800,
				Damage = 70,
				Range = 50,
				AttackCooldown = 0.18,
				ModelName = "BirdGunner_Tier4"
			}
		}
	},
	Firecracker = {
		DisplayName = "Firecracker",
		Description = "Launches explosive festive charges that burst into a chain-reaction of fiery sparks.",
		Cost = 450,
		Upgrades = {
			[1] = {
				Cost = 500,
				Damage = 45,
				Range = 20,
				AttackCooldown = 1.6,
				ModelName = "Firecracker_Tier1"
			},
			[2] = {
				Cost = 1000,
				Damage = 75,
				Range = 22,
				AttackCooldown = 1.4,
				ModelName = "Firecracker_Tier2"
			},
			[3] = {
				Cost = 2000,
				Damage = 120,
				Range = 25,
				AttackCooldown = 1.2,
				ModelName = "Firecracker_Tier3"
			},
			[4] = {
				Cost = 3800,
				Damage = 190,
				Range = 28,
				AttackCooldown = 0.9,
				ModelName = "Firecracker_Tier4"
			}
		}
	},
	MoabTrooper = {
		DisplayName = "MOAB Trooper",
		Description = "Heavy armor-piercing specialist designed specifically to shred high-health elite targets.",
		Cost = 650,
		Upgrades = {
			[1] = {
				Cost = 750,
				Damage = 135,
				Range = 24,
				AttackCooldown = 3.0,
				ModelName = "MoabTrooper_Tier1"
			},
			[2] = {
				Cost = 1500,
				Damage = 210,
				Range = 26,
				AttackCooldown = 2.7,
				ModelName = "MoabTrooper_Tier2"
			},
			[3] = {
				Cost = 3000,
				Damage = 340,
				Range = 29,
				AttackCooldown = 2.3,
				ModelName = "MoabTrooper_Tier3"
			},
			[4] = {
				Cost = 5500,
				Damage = 540,
				Range = 32,
				AttackCooldown = 1.8,
				ModelName = "MoabTrooper_Tier4"
			}
		}
	},
	BatonUser = {
		DisplayName = "Baton User",
		Description = "Melee crowd controller who swings a shock baton to stun and bludgeon nearby enemies.",
		Cost = 200,
		Upgrades = {
			[1] = {
				Cost = 250,
				Damage = 38,
				Range = 9,
				AttackCooldown = 0.8,
				ModelName = "BatonUser_Tier1"
			},
			[2] = {
				Cost = 550,
				Damage = 60,
				Range = 10,
				AttackCooldown = 0.7,
				ModelName = "BatonUser_Tier2"
			},
			[3] = {
				Cost = 1100,
				Damage = 95,
				Range = 11,
				AttackCooldown = 0.6,
				ModelName = "BatonUser_Tier3"
			},
			[4] = {
				Cost = 2100,
				Damage = 150,
				Range = 13,
				AttackCooldown = 0.45,
				ModelName = "BatonUser_Tier4"
			}
		}
	},
	TurtleCarrier = {
		DisplayName = "Turtle Carrier",
		Description = "An armored shell transport that fires heavy ballistic bolts while shielding allies.",
		Cost = 550,
		Upgrades = {
			[1] = {
				Cost = 650,
				Damage = 75,
				Range = 30,
				AttackCooldown = 2.8,
				ModelName = "TurtleCarrier_Tier1"
			},
			[2] = {
				Cost = 1300,
				Damage = 120,
				Range = 32,
				AttackCooldown = 2.5,
				ModelName = "TurtleCarrier_Tier2"
			},
			[3] = {
				Cost = 2600,
				Damage = 190,
				Range = 35,
				AttackCooldown = 2.1,
				ModelName = "TurtleCarrier_Tier3"
			},
			[4] = {
				Cost = 4800,
				Damage = 310,
				Range = 39,
				AttackCooldown = 1.7,
				ModelName = "TurtleCarrier_Tier4"
			}
		}
	}
}

return TowerData
Implementing Upgrades in Your Game
To switch models and apply upgraded stats during gameplay, store the current tier value directly inside the active tower instance (e.g., using an attribute tower:SetAttribute("Tier", currentTier)).

When a player requests an upgrade, check the next tier index in TowerData.Towers[towerName].Upgrades[nextTier], deduct the upgrade cost from their money balance, swap the visual model using the specified ModelName template from ServerStorage.Towers, and update the tower's runtime stats (damage, range, and cooldown).

now make canon, wizzard and firecrakcer, be capable of dealing crowd damage

To enable towers like the Cannon, Wizard, and Firecracker to deal crowd (splash/area-of-effect) damage, you need to update the server-side attack loop so that when they strike their primary target, all other enemies within a specific blast radius also take damage.

Updated Server Attack Logic (ServerScriptService.GameManager)
Replace or update the attack coroutine block inside your tower spawning logic in your main server script to handle area-of-effect (AoE) splash damage:

Lua
-- Tower Attack Behavior with Splash Damage Support
task.spawn(function()
	while towerModel.Parent do
		-- Get current stats (supports base or upgraded stats)
		local currentTier = towerModel:GetAttribute("Tier") or 1
		local towerInfo = TowerData.Towers[towerName]
		local stats = towerInfo.Upgrades and towerInfo.Upgrades[currentTier] or towerInfo
		
		task.wait(stats.AttackCooldown)
		
		-- Find closest enemy within range
		local closestEnemy = nil
		local shortestDistance = stats.Range
		local basePart = towerModel:FindFirstChild("BasePart") or towerModel.PrimaryPart
		
		if not basePart then continue end
		
		for _, enemy in ipairs(ActiveEnemies:GetChildren()) do
			local dist = (enemy.Position - basePart.Position).Magnitude
			if dist <= shortestDistance then
				shortestDistance = dist
				closestEnemy = enemy
			end
		end
		
		if closestEnemy and closestEnemy:FindFirstChildOfClass("Humanoid") then
			-- Define splash radius based on tower type
			local splashRadius = 0
			if towerName == "Cannon" then
				splashRadius = 8 -- Cannon splash range
			elseif towerName == "Wizard" then
				splashRadius = 10 -- Wizard magic blast range
			elseif towerName == "Firecracker" then
				splashRadius = 12 -- Firecracker chain-reaction spark range
			end
			
			if splashRadius > 0 then
				-- AOE / Splash Damage Loop
				for _, enemy in ipairs(ActiveEnemies:GetChildren()) do
					local humanoid = enemy:FindFirstChildOfClass("Humanoid")
					if humanoid and humanoid.Health > 0 then
						local distToTarget = (enemy.Position - closestEnemy.Position).Magnitude
						if distToTarget <= splashRadius then
							humanoid:TakeDamage(stats.Damage)
						end
					end
				end
			else
				-- Single Target Damage (for Archers, Gunner, etc.)
				closestEnemy:FindFirstChildOfClass("Humanoid"):TakeDamage(stats.Damage)
			end
		end
	end
end)
How This Works:
Dynamic Stat Retrieval: It checks the current upgrade tier of the tower (towerModel:GetAttribute("Tier")) to ensure upgraded damage values apply correctly.

AoE Filtering: If the tower name is a Cannon, Wizard, or Firecracker, it triggers a secondary radius check centered around the primary hit enemy.

Splash Application: Every enemy found within that blast radius (splashRadius) receives the full attack damage simultaneously, creating effective crowd control against grouped enemy waves.

can you make it so archer:free canon:free, wizard: 300$, birdgunner: 200$ firecracker: 170$, MoabTrooper: 1000$, BatonUser:800$ and TurtleCarrier: 500$ in the shop, can you alos change the stats of evrything to carrie over depending the price the stronger the tower

Lua
local TowerData = {}

TowerData.Towers = {
	BasicArcher = {
		DisplayName = "Basic Archer",
		Description = "A free, reliable ranged attacker with fast speed.",
		Cost = 0,
		Upgrades = {
			[1] = {
				Cost = 50,
				Damage = 15,
				Range = 20,
				AttackCooldown = 0.9,
				ModelName = "Archer_Tier1"
			},
			[2] = {
				Cost = 120,
				Damage = 25,
				Range = 22,
				AttackCooldown = 0.8,
				ModelName = "Archer_Tier2"
			},
			[3] = {
				Cost = 250,
				Damage = 40,
				Range = 25,
				AttackCooldown = 0.7,
				ModelName = "Archer_Tier3"
			},
			[4] = {
				Cost = 500,
				Damage = 65,
				Range = 28,
				AttackCooldown = 0.5,
				ModelName = "Archer_Tier4"
			}
		}
	},
	Cannon = {
		DisplayName = "Cannon",
		Description = "A free heavy splash damage dealer, but attacks slowly.",
		Cost = 0,
		Upgrades = {
			[1] = {
				Cost = 100,
				Damage = 45,
				Range = 16,
				AttackCooldown = 2.5,
				ModelName = "Cannon_Tier1"
			},
			[2] = {
				Cost = 220,
				Damage = 75,
				Range = 18,
				AttackCooldown = 2.2,
				ModelName = "Cannon_Tier2"
			},
			[3] = {
				Cost = 450,
				Damage = 120,
				Range = 20,
				AttackCooldown = 1.9,
				ModelName = "Cannon_Tier3"
			},
			[4] = {
				Cost = 900,
				Damage = 190,
				Range = 23,
				AttackCooldown = 1.5,
				ModelName = "Cannon_Tier4"
			}
		}
	},
	Firecracker = {
		DisplayName = "Firecracker",
		Description = "A low-cost crowd clearer launching festive explosive charges.",
		Cost = 170,
		Upgrades = {
			[1] = {
				Cost = 200,
				Damage = 28,
				Range = 18,
				AttackCooldown = 1.8,
				ModelName = "Firecracker_Tier1"
			},
			[2] = {
				Cost = 400,
				Damage = 50,
				Range = 20,
				AttackCooldown = 1.5,
				ModelName = "Firecracker_Tier2"
			},
			[3] = {
				Cost = 850,
				Damage = 85,
				Range = 23,
				AttackCooldown = 1.2,
				ModelName = "Firecracker_Tier3"
			},
			[4] = {
				Cost = 1700,
				Damage = 140,
				Range = 26,
				AttackCooldown = 0.9,
				ModelName = "Firecracker_Tier4"
			}
		}
	},
	BirdGunner = {
		DisplayName = "Bird Gunner",
		Description = "A swift avian marksman firing rapid-fire feathers from afar.",
		Cost = 200,
		Upgrades = {
			[1] = {
				Cost = 220,
				Damage = 14,
				Range = 35,
				AttackCooldown = 0.35,
				ModelName = "BirdGunner_Tier1"
			},
			[2] = {
				Cost = 450,
				Damage = 24,
				Range = 38,
				AttackCooldown = 0.30,
				ModelName = "BirdGunner_Tier2"
			},
			[3] = {
				Cost = 900,
				Damage = 40,
				Range = 42,
				AttackCooldown = 0.25,
				ModelName = "BirdGunner_Tier3"
			},
			[4] = {
				Cost = 1800,
				Damage = 65,
				Range = 46,
				AttackCooldown = 0.18,
				ModelName = "BirdGunner_Tier4"
			}
		}
	},
	Wizard = {
		DisplayName = "Wizard",
		Description = "A magical master of high-damage crowd control.",
		Cost = 300,
		Upgrades = {
			[1] = {
				Cost = 350,
				Damage = 60,
				Range = 24,
				AttackCooldown = 2.0,
				ModelName = "Wizard_Tier1"
			},
			[2] = {
				Cost = 700,
				Damage = 100,
				Range = 27,
				AttackCooldown = 1.7,
				ModelName = "Wizard_Tier2"
			},
			[3] = {
				Cost = 1400,
				Damage = 160,
				Range = 30,
				AttackCooldown = 1.4,
				ModelName = "Wizard_Tier3"
			},
			[4] = {
				Cost = 2800,
				Damage = 250,
				Range = 34,
				AttackCooldown = 1.1,
				ModelName = "Wizard_Tier4"
			}
		}
	},
	TurtleCarrier = {
		DisplayName = "Turtle Carrier",
		Description = "An armored shell transport firing heavy ballistic bolts.",
		Cost = 500,
		Upgrades = {
			[1] = {
				Cost = 550,
				Damage = 70,
				Range = 28,
				AttackCooldown = 2.7,
				ModelName = "TurtleCarrier_Tier1"
			},
			[2] = {
				Cost = 1100,
				Damage = 115,
				Range = 30,
				AttackCooldown = 2.4,
				ModelName = "TurtleCarrier_Tier2"
			},
			[3] = {
				Cost = 2200,
				Damage = 180,
				Range = 33,
				AttackCooldown = 2.0,
				ModelName = "TurtleCarrier_Tier3"
			},
			[4] = {
				Cost = 4200,
				Damage = 290,
				Range = 37,
				AttackCooldown = 1.6,
				ModelName = "TurtleCarrier_Tier4"
			}
		}
	},
	BatonUser = {
		DisplayName = "Baton User",
		Description = "Close-quarters crowd controller who swings a high-impact shock baton.",
		Cost = 800,
		Upgrades = {
			[1] = {
				Cost = 850,
				Damage = 110,
				Range = 10,
				AttackCooldown = 0.7,
				ModelName = "BatonUser_Tier1"
			},
			[2] = {
				Cost = 1700,
				Damage = 185,
				Range = 11,
				AttackCooldown = 0.6,
				ModelName = "BatonUser_Tier2"
			},
			[3] = {
				Cost = 3400,
				Damage = 290,
				Range = 12,
				AttackCooldown = 0.5,
				ModelName = "BatonUser_Tier3"
			},
			[4] = {
				Cost = 6500,
				Damage = 460,
				Range = 14,
				AttackCooldown = 0.38,
				ModelName = "BatonUser_Tier4"
			}
		}
	},
	MoabTrooper = {
		DisplayName = "MOAB Trooper",
		Description = "The ultimate heavy armor-piercing elite executioner.",
		Cost = 1000,
		Upgrades = {
			[1] = {
				Cost = 1200,
				Damage = 220,
				Range = 25,
				AttackCooldown = 2.8,
				ModelName = "MoabTrooper_Tier1"
			},
			[2] = {
				Cost = 2500,
				Damage = 380,
				Range = 28,
				AttackCooldown = 2.4,
				ModelName = "MoabTrooper_Tier2"
			},
			[3] = {
				Cost = 5000,
				Damage = 620,
				Range = 31,
				AttackCooldown = 2.0,
				ModelName = "MoabTrooper_Tier3"
			},
			[4] = {
				Cost = 10000,
				Damage = 1000,
				Range = 35,
				AttackCooldown = 1.5,
				ModelName = "MoabTrooper_Tier4"
			}
		}
	}
}

return TowerData
when the towers get upgraded to they change model or noÉ

The code provided in the TowerData module includes a ModelName property for every single upgrade tier (e.g., "Archer_Tier1", "Archer_Tier2", etc.). However, the code alone will not automatically swap the 3ْد visual models in your game world unless you write a short server-side function to handle that visual swap when the upgrade request is processed.

To make the models actually change when upgraded, add a function like this to your server-side upgrade handler:

Lua
local function updateTowerModel(towerModel, towerName, newTier)
	local towerInfo = TowerData.Towers[towerName]
	if not towerInfo or not towerInfo.Upgrades[newTier] then return end
	
	local targetModelName = towerInfo.Upgrades[newTier].ModelName
	local templateModel = ServerStorage.Towers:FindFirstChild(targetModelName)
	
	if templateModel then
		-- Get current position and orientation of the tower's base part/primary part
		local currentCF = towerModel:GetPrimaryPartCFrame() or towerModel.WorldPivot
		
		-- Clear old visual children (except core tracking parts if needed)
		for _, child in ipairs(towerModel:GetChildren()) do
			if child:IsA("Model") or child:IsA("BasePart") then
				child:Destroy()
			end
		end
		
		-- Clone and apply the new tier model
		local newVisuals = templateModel:Clone()
		for _, descendant in ipairs(newVisuals:GetChildren()) do
			descendant.Parent = towerModel
		end
		
		-- Ensure model alignment
		if towerModel.PrimaryPart then
			towerModel:SetPrimaryPartCFrame(currentCF)
		end
		
		-- Update the tier attribute
		towerModel:SetAttribute("Tier", newTier)
	else
		warn("Missing model template in ServerStorage.Towers for: " .. tostring(targetModelName))
	end
end
What you need to do in Roblox Studio:
Go to ServerStorage > Towers.

Create separate 3D models or parts for each tier of your towers and name them exactly to match the configuration (e.g., Archer_Tier1, Archer_Tier2, Archer_Tier3, Archer_Tier4, etc.).


