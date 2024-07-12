using ApiWebApp.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Net.Mail;
using System.Threading.Tasks;
using System;
using MimeKit;
using MailKit.Net.Smtp;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet(Name = "GetLogin")]
        public async Task<IActionResult> Get(string loginName, string password)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            bool loginSuccess = false;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                using (SqlCommand command = new SqlCommand(
                    "SELECT COUNT(*) FROM LOGIN WHERE LOGIN_NAME = @loginName AND PASSWORD = @password", connection))
                {
                    command.Parameters.AddWithValue("@loginName", loginName);
                    command.Parameters.AddWithValue("@password", password);

                    int count = (int)await command.ExecuteScalarAsync();
                    loginSuccess = count > 0;
                }
            }

            if (loginSuccess)
            {
                return Ok("Login successful");
            }
            else
            {
                return Unauthorized("Invalid login credentials");
            }
        }

        [HttpPost(Name = "RegisterUser")]
        public async Task<IActionResult> Post([FromBody] UserModel user)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            // Gerando um novo ID único
            string id = Guid.NewGuid().ToString();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(
                        "INSERT INTO [USER] (ID, NAME) VALUES (@id, @name);", connection))
                    {
                        command.Parameters.AddWithValue("@id", id);
                        command.Parameters.AddWithValue("@name", user.FullName);
                        await command.ExecuteNonQueryAsync();
                    }

                    using (SqlCommand command = new SqlCommand(
                        $"INSERT INTO LOGIN (ID, LOGIN_NAME, PASSWORD, USER_ID) VALUES (@id, @loginName, @password, @userId);", connection))
                    {
                        command.Parameters.AddWithValue("@id", Guid.NewGuid().ToString());
                        command.Parameters.AddWithValue("@loginName", user.LoginName);
                        command.Parameters.AddWithValue("@password", user.Password);
                        command.Parameters.AddWithValue("@userId", id);

                        await command.ExecuteNonQueryAsync();
                    }
                }

                return Ok("User registered successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
