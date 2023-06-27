function INIT()

end

function UPDATE(dt)


  -- print(BUTTON_JUST_PRESSED("LEFT"))

  if (BUTTON_JUST_PRESSED("RIGHT")) then
    if (IS_PAUSED) then
      RESUME()
    else
      PAUSE()
    end
  end
end

function GAME_UPDATE(dt)
  if BUTTON_PRESSED("LEFT") then
    SET_ENABLED(1, true)
  else
    SET_ENABLED(1, false)
  end
end

function DRAW()
  
end