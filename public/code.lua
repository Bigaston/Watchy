function INIT()
  print("Engine Init")

  -- print(SET_ENABLED)
  -- SET_ENABLED(1, true)
end

elapsed = 0

function UPDATE(dt)
  elapsed = elapsed + 0.01


  if (math.floor(elapsed%2) == 0) then
    SET_ENABLED(1, true)
  else
    SET_ENABLED(1, false)
  end
end

function DRAW()
end