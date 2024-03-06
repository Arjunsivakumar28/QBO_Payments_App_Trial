@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  QBO_Payments_App startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..

@rem Add default JVM options here. You can also use JAVA_OPTS and QBO_PAYMENTS_APP_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:init
@rem Get command-line arguments, handling Windows variants

if not "%OS%" == "Windows_NT" goto win9xME_args

:win9xME_args
@rem Slurp the command line arguments.
set CMD_LINE_ARGS=
set _SKIP=2

:win9xME_args_slurp
if "x%~1" == "x" goto execute

set CMD_LINE_ARGS=%*

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\lib\QBO_Payments_App-0.1.0.jar;%APP_HOME%\lib\payments-api-6.2.4.jar;%APP_HOME%\lib\ipp-v3-java-devkit-4.0.1-jar-with-dependencies.jar;%APP_HOME%\lib\ipp-v3-java-data-4.0.1.jar;%APP_HOME%\lib\oauth2-platform-api-4.0.1-jar-with-dependencies.jar;%APP_HOME%\lib\spring-boot-starter-web-2.1.0.RELEASE.jar;%APP_HOME%\lib\spring-boot-starter-thymeleaf-2.1.0.RELEASE.jar;%APP_HOME%\lib\spring-data-rest-webmvc-3.1.2.RELEASE.jar;%APP_HOME%\lib\json-20160810.jar;%APP_HOME%\lib\log4j-1.2.17.jar;%APP_HOME%\lib\commons-configuration-1.6.jar;%APP_HOME%\lib\commons-lang-2.6.jar;%APP_HOME%\lib\jackson-jaxrs-json-provider-2.9.7.jar;%APP_HOME%\lib\jackson-module-jaxb-annotations-2.9.7.jar;%APP_HOME%\lib\thymeleaf-spring5-3.0.11.RELEASE.jar;%APP_HOME%\lib\thymeleaf-extras-java8time-3.0.1.RELEASE.jar;%APP_HOME%\lib\spring-data-rest-core-3.1.2.RELEASE.jar;%APP_HOME%\lib\thymeleaf-3.0.11.RELEASE.jar;%APP_HOME%\lib\spring-hateoas-0.25.0.RELEASE.jar;%APP_HOME%\lib\spring-data-commons-2.1.2.RELEASE.jar;%APP_HOME%\lib\spring-plugin-core-1.2.0.RELEASE.jar;%APP_HOME%\lib\spring-boot-starter-json-2.1.0.RELEASE.jar;%APP_HOME%\lib\spring-boot-starter-2.1.0.RELEASE.jar;%APP_HOME%\lib\spring-boot-starter-logging-2.1.0.RELEASE.jar;%APP_HOME%\lib\logback-classic-1.2.3.jar;%APP_HOME%\lib\log4j-to-slf4j-2.11.1.jar;%APP_HOME%\lib\jul-to-slf4j-1.7.25.jar;%APP_HOME%\lib\slf4j-api-1.7.25.jar;%APP_HOME%\lib\signpost-commonshttp4-1.2.jar;%APP_HOME%\lib\httpclient-4.5.6.jar;%APP_HOME%\lib\httpcore-4.4.10.jar;%APP_HOME%\lib\ant-1.10.11.jar;%APP_HOME%\lib\jackson-datatype-joda-2.9.7.jar;%APP_HOME%\lib\joda-time-2.10.1.jar;%APP_HOME%\lib\jaxb2-commons-lang-2.4.jar;%APP_HOME%\lib\jaxb2-basics-runtime-1.11.1.jar;%APP_HOME%\lib\signpost-core-1.2.1.1.jar;%APP_HOME%\lib\commons-digester-1.8.jar;%APP_HOME%\lib\commons-beanutils-core-1.8.0.jar;%APP_HOME%\lib\commons-beanutils-1.7.0.jar;%APP_HOME%\lib\commons-logging-1.2.jar;%APP_HOME%\lib\gson-2.8.5.jar;%APP_HOME%\lib\commons-io-2.5.jar;%APP_HOME%\lib\cglib-2.2.2.jar;%APP_HOME%\lib\asm-commons-3.3.1.jar;%APP_HOME%\lib\kxml2-2.2.2.jar;%APP_HOME%\lib\mailapi-1.4.3.jar;%APP_HOME%\lib\jaxb-api-2.3.1.jar;%APP_HOME%\lib\jaxb-impl-2.2.11.jar;%APP_HOME%\lib\jaxb-core-2.2.11.jar;%APP_HOME%\lib\jackson-jaxrs-base-2.9.7.jar;%APP_HOME%\lib\jackson-datatype-jdk8-2.9.7.jar;%APP_HOME%\lib\jackson-datatype-jsr310-2.9.7.jar;%APP_HOME%\lib\jackson-module-parameter-names-2.9.7.jar;%APP_HOME%\lib\jackson-databind-2.9.7.jar;%APP_HOME%\lib\jackson-annotations-2.9.0.jar;%APP_HOME%\lib\jackson-core-2.9.7.jar;%APP_HOME%\lib\spring-boot-starter-tomcat-2.1.0.RELEASE.jar;%APP_HOME%\lib\hibernate-validator-6.0.13.Final.jar;%APP_HOME%\lib\spring-webmvc-5.1.2.RELEASE.jar;%APP_HOME%\lib\spring-web-5.1.2.RELEASE.jar;%APP_HOME%\lib\commons-codec-1.11.jar;%APP_HOME%\lib\ant-launcher-1.10.11.jar;%APP_HOME%\lib\commons-lang3-3.8.1.jar;%APP_HOME%\lib\commons-collections-3.2.1.jar;%APP_HOME%\lib\asm-tree-3.3.1.jar;%APP_HOME%\lib\asm-3.3.1.jar;%APP_HOME%\lib\xmlpull-1.1.3.1.jar;%APP_HOME%\lib\activation-1.1.jar;%APP_HOME%\lib\javax.activation-api-1.2.0.jar;%APP_HOME%\lib\spring-boot-autoconfigure-2.1.0.RELEASE.jar;%APP_HOME%\lib\spring-boot-2.1.0.RELEASE.jar;%APP_HOME%\lib\javax.annotation-api-1.3.2.jar;%APP_HOME%\lib\spring-context-5.1.2.RELEASE.jar;%APP_HOME%\lib\spring-aop-5.1.2.RELEASE.jar;%APP_HOME%\lib\spring-tx-5.1.2.RELEASE.jar;%APP_HOME%\lib\spring-beans-5.1.2.RELEASE.jar;%APP_HOME%\lib\spring-expression-5.1.2.RELEASE.jar;%APP_HOME%\lib\spring-core-5.1.2.RELEASE.jar;%APP_HOME%\lib\snakeyaml-1.23.jar;%APP_HOME%\lib\tomcat-embed-websocket-9.0.12.jar;%APP_HOME%\lib\tomcat-embed-core-9.0.12.jar;%APP_HOME%\lib\tomcat-embed-el-9.0.12.jar;%APP_HOME%\lib\validation-api-2.0.1.Final.jar;%APP_HOME%\lib\jboss-logging-3.3.2.Final.jar;%APP_HOME%\lib\classmate-1.4.0.jar;%APP_HOME%\lib\evo-inflector-1.2.2.jar;%APP_HOME%\lib\spring-jcl-5.1.2.RELEASE.jar;%APP_HOME%\lib\attoparser-2.0.5.RELEASE.jar;%APP_HOME%\lib\unbescape-1.1.6.RELEASE.jar;%APP_HOME%\lib\logback-core-1.2.3.jar;%APP_HOME%\lib\log4j-api-2.11.1.jar

@rem Execute QBO_Payments_App
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %QBO_PAYMENTS_APP_OPTS%  -classpath "%CLASSPATH%" com.intuit.developer.helloworld.Application %CMD_LINE_ARGS%

:end
@rem End local scope for the variables with windows NT shell
if "%ERRORLEVEL%"=="0" goto mainEnd

:fail
rem Set variable QBO_PAYMENTS_APP_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
if  not "" == "%QBO_PAYMENTS_APP_EXIT_CONSOLE%" exit 1
exit /b 1

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
