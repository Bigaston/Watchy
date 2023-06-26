function INIT()

end

function UPDATE(dt)
  if BUTTON_PRESSED("LEFT") then
    SET_ENABLED(1, true)
  else
    SET_ENABLED(1, false)
  end

  -- print(BUTTON_JUST_PRESSED("LEFT"))

  if (BUTTON_JUST_PRESSED("LEFT")) then
    print("Left pressed")
  end
end

function DRAW()
  
end