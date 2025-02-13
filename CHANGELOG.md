# SexFM Player Changelog

## v1.2.0
- Added web browser support
- Better handle the API sending a non-existent song
- Improved stream reloading in terms of performance and edge-cases
- Fixed a bug where pausing and playing the radio ignored whether it was supposed to be muted
- Made the mute button grey
- Enabled compilation optimizations to make the binary smaller
- Added simple privacy-focused analytics powered by [plausible.io](https://plausible.io)
- Added logic to resume playback if the audio stream abruptly ends... why does this happen
- Various major internal improvements

## v1.1.0
- Renamed all references of "Client" to "Player"
- Made buttons look more Sex... FM
- Added artist names to the Last Played list... whoops
- Drastically optimized assets to reduce file size
- Updated the Last Played and Help user interface to be more futuristic and cooler
- Added a dedicated settings popup
- Fixed pausing causing desync from the live stream
- Improved font fallbacks
- Added an auto-updater... I think...
- Added an option to select the audio format
- Manually fixed an issue with the API where it can't decide what song is currently playing
- Various minor fixes and improvements

You may need to manually uninstall the previous version, sorry.

## v1.0.0
- Initial release
