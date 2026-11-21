include(FetchContent)
FetchContent_Declare(Catch2
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG v3.16.1
  GIT_SHALLOW TRUE)
FetchContent_MakeAvailable(Catch2)

add_executable(kr_core_test kr_core_test.cpp)
target_link_libraries(kr_core_test PRIVATE kr_core Catch2::Catch2WithMain)
add_test(NAME kr_core_test COMMAND kr_core_test)
