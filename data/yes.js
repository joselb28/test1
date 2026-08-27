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
