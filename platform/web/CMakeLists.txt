add_executable(kr main.cpp)
target_link_libraries(kr PRIVATE kr_core)
target_compile_options(kr PRIVATE --use-port=emdawnwebgpu)
target_link_options(kr PRIVATE
  --use-port=emdawnwebgpu
  -sWASM=1
  -sALLOW_MEMORY_GROWTH=1
  -sASSERTIONS=1
)
set_target_properties(kr PROPERTIES
  OUTPUT_NAME kr
  SUFFIX .js
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}"
)
add_custom_command(TARGET kr POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_SOURCE_DIR}/web/index.html $<TARGET_FILE_DIR:kr>/index.html
)
